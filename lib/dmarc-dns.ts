// lib/dmarc-dns.ts
// Pure DNS-record classification/analysis for the email-auth checker. Kept out
// of the route handler so it can be unit-tested without performing live DNS.

export type Status = "ok" | "warn" | "fail" | "missing";

/**
 * Classify a node:dns rejection. A record that genuinely doesn't exist must not
 * be confused with a resolver that's momentarily failing — otherwise a SERVFAIL
 * or timeout gets reported to the user as "you have no SPF/DMARC", tanking their
 * score on a false negative.
 */
export function classifyDnsError(err: unknown): "missing" | "transient" {
  const code = (err as { code?: string } | null)?.code;
  // ENOTFOUND = NXDOMAIN; ENODATA = name exists but no record of this type.
  // Both mean the record truly isn't there. Everything else (SERVFAIL, timeout,
  // refused, …) is a resolver problem, not a verdict about the domain.
  if (code === "ENOTFOUND" || code === "ENODATA") return "missing";
  return "transient";
}

/**
 * True only when a TXT record at `<selector>._domainkey` is actually a DKIM key
 * — it declares v=DKIM1 or publishes a p= public-key tag. Guards against
 * counting an unrelated/leftover TXT at the probed name as a valid selector,
 * which would otherwise award DKIM credit for a record that isn't DKIM.
 */
export function isDkimKeyRecord(record: string): boolean {
  return /(^|;|\s)v=DKIM1\b/i.test(record) || /(^|;|\s)p=/i.test(record);
}

/**
 * Parse a `k=v; k=v` tag record (the shape DMARC, MTA-STS, TLS-RPT and BIMI all
 * share). Keys come from a TXT record any domain can publish, so the result is a
 * null-prototype object — a plain literal would be polluted by a `__proto__=` tag.
 */
export function parseTagRecord(record: string): Record<string, string> {
  const tags: Record<string, string> = Object.create(null);
  for (const part of record.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim().toLowerCase();
    if (key) tags[key] = part.slice(eq + 1).trim();
  }
  return tags;
}

/** Pull every record matching a version tag out of a TXT lookup result. */
function recordsMatching(txt: string[][] | null, version: RegExp): string[] {
  if (!txt) return [];
  return txt.map((parts) => parts.join("").trim()).filter((r) => version.test(r));
}

// ── DMARC ───────────────────────────────────────────────────────────────────

export interface DmarcAnalysis {
  record: string | null;
  policy: string | null;
  subdomainPolicy: string | null;
  pct: number;
  /** True only when the policy actually acts on mail: enforcing p, full pct, and no weaker sp. */
  enforcing: boolean;
  hasReporting: boolean;
  issues: string[];
  status: Status;
}

export function findDmarcRecords(txt: string[][] | null): string[] {
  return recordsMatching(txt, /^v=DMARC1\b/i);
}

export function analyzeDmarc(records: string[]): DmarcAnalysis {
  const empty = {
    record: null,
    policy: null,
    subdomainPolicy: null,
    pct: 100,
    enforcing: false,
    hasReporting: false,
  };

  if (records.length === 0) {
    return {
      ...empty,
      issues: [
        "No DMARC record found. Even with SPF and DKIM in place, receivers don't know what to do when a message fails. Spoofing protection is incomplete without DMARC.",
      ],
      status: "missing",
    };
  }
  if (records.length > 1) {
    // RFC 7489: more than one DMARC record means receivers must ignore all of
    // them — so publishing two is worse than publishing one.
    return {
      ...empty,
      issues: [
        `${records.length} DMARC records are published at _dmarc. The spec requires receivers to ignore all of them, so right now you effectively have no DMARC. Delete all but one.`,
      ],
      status: "fail",
    };
  }

  const record = records[0]!;
  const tags = parseTagRecord(record);
  const policy = normalizePolicy(tags.p);
  const subdomainPolicy = normalizePolicy(tags.sp);
  const pct = parsePct(tags.pct);
  const hasReporting = /\bmailto:/i.test(tags.rua ?? "") || /\bmailto:/i.test(tags.ruf ?? "");

  const issues: string[] = [];
  let status: Exclude<Status, "missing"> = "ok";
  const warn = () => {
    if (status === "ok") status = "warn";
  };

  if (!policy) {
    issues.push("No policy ('p=') tag found. DMARC requires a policy, so this record does nothing.");
    status = "fail";
  } else if (policy === "none") {
    issues.push(
      "Policy is 'p=none' — reports only, no enforcement. Receivers will not block spoofed mail. Good for initial monitoring; move to 'quarantine' or 'reject' once SPF/DKIM align cleanly."
    );
    warn();
  }

  // pct only means anything on an enforcing policy, but a low pct there is the
  // classic "looks protected, isn't" configuration.
  if (pct < 100) {
    if (policy === "quarantine" || policy === "reject") {
      issues.push(
        `Policy says '${policy}' but 'pct=${pct}' — it is only applied to ${pct}% of failing mail. The other ${100 - pct}% is delivered as if you had p=none. Raise to pct=100 once you're confident.`
      );
      warn();
    } else {
      issues.push(`'pct=${pct}' has no effect while the policy is 'p=none'.`);
    }
  }

  // A strong p with a weak sp leaves every subdomain spoofable — a common gap.
  if (subdomainPolicy === "none" && (policy === "quarantine" || policy === "reject")) {
    issues.push(
      `Policy is '${policy}' but 'sp=none' — subdomains are exempt, so anyone can still spoof mail from a subdomain of your domain. Remove 'sp' (subdomains then inherit p) or set it to '${policy}'.`
    );
    warn();
  }

  if (!hasReporting) {
    issues.push(
      "No 'rua' reporting address. You're flying blind on which senders are using your domain, and the reports are how you safely reach enforcement. Add 'rua=mailto:dmarc@yourdomain.com'."
    );
    warn();
  }

  const enforcing =
    (policy === "quarantine" || policy === "reject") &&
    pct === 100 &&
    subdomainPolicy !== "none";

  return { record, policy, subdomainPolicy, pct, enforcing, hasReporting, issues, status };
}

function normalizePolicy(raw: string | undefined): string | null {
  const v = (raw ?? "").trim().toLowerCase();
  return v === "none" || v === "quarantine" || v === "reject" ? v : null;
}

function parsePct(raw: string | undefined): number {
  const n = Number.parseInt((raw ?? "").trim(), 10);
  // Absent or unparseable pct means 100 per the spec; clamp anything silly.
  if (!Number.isFinite(n)) return 100;
  return Math.min(100, Math.max(0, n));
}

// ── MTA-STS / TLS-RPT / BIMI (optional hardening, reported but not scored) ───

export interface SimpleRecordCheck {
  found: boolean;
  record: string | null;
  detail: string;
  status: Status;
}

export function analyzeMtaSts(txt: string[][] | null): SimpleRecordCheck {
  const records = recordsMatching(txt, /^v=STSv1\b/i);
  if (records.length === 0) {
    return {
      found: false,
      record: null,
      detail:
        "No MTA-STS record. Mail servers will deliver to you over plaintext if TLS negotiation is stripped, which makes a downgrade attack possible.",
      status: "missing",
    };
  }
  const tags = parseTagRecord(records[0]!);
  if (!tags.id) {
    return {
      found: true,
      record: records[0]!,
      detail: "MTA-STS record is published but has no 'id' tag, so receivers can't tell when the policy changes.",
      status: "warn",
    };
  }
  return {
    found: true,
    record: records[0]!,
    detail:
      "MTA-STS record published. Note: we check the DNS record only — the policy file at https://mta-sts.<domain>/.well-known/mta-sts.txt must also be served for it to take effect.",
    status: "ok",
  };
}

export function analyzeTlsRpt(txt: string[][] | null): SimpleRecordCheck {
  const records = recordsMatching(txt, /^v=TLSRPTv1\b/i);
  if (records.length === 0) {
    return {
      found: false,
      record: null,
      detail:
        "No TLS-RPT record. You won't be told when someone fails to deliver mail to you over TLS — useful early warning that pairs with MTA-STS.",
      status: "missing",
    };
  }
  const tags = parseTagRecord(records[0]!);
  if (!/\b(mailto:|https:)/i.test(tags.rua ?? "")) {
    return {
      found: true,
      record: records[0]!,
      detail: "TLS-RPT record is published but has no valid 'rua' destination, so no reports will reach you.",
      status: "warn",
    };
  }
  return { found: true, record: records[0]!, detail: "TLS-RPT reporting is configured.", status: "ok" };
}

export function analyzeBimi(txt: string[][] | null): SimpleRecordCheck {
  const records = recordsMatching(txt, /^v=BIMI1\b/i);
  if (records.length === 0) {
    return {
      found: false,
      record: null,
      detail:
        "No BIMI record. Optional — it shows your logo next to your mail in supporting clients, but it requires DMARC at enforcement first (and usually a paid VMC).",
      status: "missing",
    };
  }
  const tags = parseTagRecord(records[0]!);
  if (!tags.l) {
    return {
      found: true,
      record: records[0]!,
      detail: "BIMI record is published but has no 'l=' logo URL, so nothing will display.",
      status: "warn",
    };
  }
  return {
    found: true,
    record: records[0]!,
    detail: tags.a
      ? "BIMI is configured with a logo and a VMC."
      : "BIMI logo is configured. Most large mailbox providers also require a VMC ('a=') before they'll display it.",
    status: "ok",
  };
}

// ── Copy-paste fixes ────────────────────────────────────────────────────────

export interface SuggestedRecord {
  /** DNS name to create, already qualified for the checked domain. */
  name: string;
  type: "TXT";
  value: string;
  why: string;
}

/** SPF include for the mail provider we detected from MX, when we know it. */
function spfIncludeFor(provider: string | null): string | null {
  switch (provider) {
    case "Google Workspace":
      return "include:_spf.google.com";
    case "Microsoft 365":
      return "include:spf.protection.outlook.com";
    case "Proton Mail":
      return "include:_spf.protonmail.ch";
    case "Zoho Mail":
      return "include:zoho.com";
    case "Fastmail":
      return "include:spf.messagingengine.com";
    case "iCloud Mail":
      return "include:icloud.com";
    default:
      return null;
  }
}

/**
 * Turn findings into records the operator can paste straight into DNS. This is
 * the whole point of the tool for a non-expert: "what exactly do I add?"
 */
export function suggestedRecords(input: {
  domain: string;
  provider: string | null;
  spfRecord: string | null;
  spfStatus: Status;
  dmarc: DmarcAnalysis;
  mtaSts: SimpleRecordCheck;
  tlsRpt: SimpleRecordCheck;
}): SuggestedRecord[] {
  const { domain, provider, spfRecord, spfStatus, dmarc, mtaSts, tlsRpt } = input;
  const out: SuggestedRecord[] = [];

  if (spfStatus === "missing") {
    const include = spfIncludeFor(provider);
    out.push({
      name: domain,
      type: "TXT",
      value: `v=spf1 ${include ?? "include:YOUR_MAIL_PROVIDER"} ~all`,
      why: include
        ? `Authorizes ${provider} to send mail as ${domain}. Add an include: for every other service that sends on your behalf.`
        : "Replace YOUR_MAIL_PROVIDER with your provider's include (and add one per sending service) before publishing.",
    });
  } else if (spfRecord && /(\+all|\?all)\b/i.test(spfRecord)) {
    out.push({
      name: domain,
      type: "TXT",
      value: spfRecord.replace(/(\+all|\?all)\b/i, "~all"),
      why: "Your current record with the unsafe 'all' qualifier replaced by '~all' (softfail).",
    });
  } else if (spfRecord && !/(~all|-all)\b/i.test(spfRecord)) {
    out.push({
      name: domain,
      type: "TXT",
      value: `${spfRecord.trim()} ~all`,
      why: "Your current record with a closing '~all' so unlisted senders are marked softfail.",
    });
  }

  if (dmarc.status === "missing") {
    out.push({
      name: `_dmarc.${domain}`,
      type: "TXT",
      value: `v=DMARC1; p=none; rua=mailto:dmarc@${domain}; fo=1`,
      why: "Start in monitoring mode. Watch the reports for ~30 days, confirm every legitimate sender aligns, then tighten to quarantine.",
    });
  } else if (dmarc.policy === "none") {
    out.push({
      name: `_dmarc.${domain}`,
      type: "TXT",
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; fo=1`,
      why: "The enforcement step — only publish this once your reports show every legitimate sender passing.",
    });
  } else if (!dmarc.hasReporting && dmarc.record) {
    out.push({
      name: `_dmarc.${domain}`,
      type: "TXT",
      value: `${dmarc.record.replace(/;\s*$/, "")}; rua=mailto:dmarc@${domain}`,
      why: "Your current record with a reporting address added, so you can see who's sending as you.",
    });
  } else if (dmarc.pct < 100 && dmarc.record) {
    out.push({
      name: `_dmarc.${domain}`,
      type: "TXT",
      value: dmarc.record.replace(/\bpct\s*=\s*\d+/i, "pct=100"),
      why: "Your current record at full enforcement, so the policy applies to all failing mail rather than a sample.",
    });
  }

  if (tlsRpt.status === "missing") {
    out.push({
      name: `_smtp._tls.${domain}`,
      type: "TXT",
      value: `v=TLSRPTv1; rua=mailto:tls@${domain}`,
      why: "Get notified when someone can't deliver mail to you over TLS. Zero risk to add.",
    });
  }

  if (mtaSts.status === "missing") {
    out.push({
      name: `_mta-sts.${domain}`,
      type: "TXT",
      value: "v=STSv1; id=CHANGEME",
      why: "MTA-STS also needs a policy file served at https://mta-sts." + domain + "/.well-known/mta-sts.txt — publish the record only once that file is live. Use a timestamp (e.g. 20260619T120000) as the id.",
    });
  }

  return out;
}
