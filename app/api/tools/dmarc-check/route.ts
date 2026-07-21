// app/api/tools/dmarc-check/route.ts
// Server-side DNS lookups for SPF / DKIM / DMARC / MX records on a given
// domain. Public endpoint, rate-limited per IP. Returns parsed records +
// plain-English issues. Used by the /tools/dmarc-check landing page.

import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import { rateLimit, getClientIp } from "@/server/rate-limit";
import {
  classifyDnsError,
  isDkimKeyRecord,
  findDmarcRecords,
  analyzeDmarc,
  analyzeMtaSts,
  analyzeTlsRpt,
  analyzeBimi,
  suggestedRecords,
  type SimpleRecordCheck,
  type SuggestedRecord,
  type Status,
} from "@/lib/dmarc-dns";

// Common DKIM selectors used by major mail providers. We probe these because
// DKIM selector names aren't discoverable from the domain itself — DNS gives
// no way to enumerate them, so we probe a curated list of the static selectors
// the major providers actually use. (Selectors that are dynamic per-account
// hashes — Amazon SES rotating keys, SparkPost scphNNNN, SendGrid sNNNNNN — are
// unguessable and deliberately omitted; the report analyzer surfaces those.)
// Selectors confirmed from real DMARC aggregate reports and live DNS are noted.
const DKIM_SELECTORS = [
  // Google Workspace
  "google",
  // Microsoft 365 / Outlook
  "selector1",
  "selector2",
  // DreamHost (confirmed: dreamhost._domainkey.akritos.com)
  "dreamhost",
  // Mailchimp (k1/k2/k3 seen in reports) + Mandrill transactional (mte1/mte2)
  "k1",
  "k2",
  "k3",
  "mte1",
  "mte2",
  // SendGrid
  "s1",
  "s2",
  "smtpapi",
  // Amazon SES (static fallback selector)
  "amazonses",
  // Postmark
  "pm",
  // Proton Mail
  "protonmail",
  "protonmail2",
  "protonmail3",
  // Zoho
  "zoho",
  "zmail",
  // Fastmail
  "fm1",
  "fm2",
  "fm3",
  // Mailgun (customer-chosen, these are the common ones)
  "mg",
  "mx",
  "pic",
  // Mailjet
  "mailjet",
  // Klaviyo
  "kl",
  "kl2",
  // Apple iCloud custom-domain
  "sig1",
  // Yahoo / AOL outbound
  "s2048",
  "s1024",
  // Generic / OpenDKIM / cPanel / GoDaddy / common defaults
  "default",
  "dkim",
  "mail",
  "email",
  "selector",
  "key1",
  "key2",
  "smtp",
  "mxvault",
] as const;

// Known mail-provider patterns we can identify from MX records. Helps the
// reader see "oh, we're on Google Workspace" without needing to interpret
// the raw MX values.
const MX_PROVIDERS: { match: RegExp; name: string }[] = [
  { match: /google\.com$|googlemail\.com$/i, name: "Google Workspace" },
  // Inbound relay fronting several shared hosts (DreamHost among them), so it
  // identifies the MX but not the sending platform — no SPF include is implied.
  { match: /mailchannels\.net$/i, name: "MailChannels" },
  { match: /outlook\.com$|protection\.outlook\.com$/i, name: "Microsoft 365" },
  { match: /mail\.protonmail\.ch$/i, name: "Proton Mail" },
  { match: /icloud\.com$|mail\.me\.com$/i, name: "iCloud Mail" },
  { match: /mailgun\.org$/i, name: "Mailgun" },
  { match: /sendgrid\.net$/i, name: "SendGrid" },
  { match: /amazonses\.com$|amazonaws\.com$/i, name: "Amazon SES" },
  { match: /zoho\.com$|zohomail\.com$/i, name: "Zoho Mail" },
  { match: /fastmail\.com$/i, name: "Fastmail" },
];

interface DkimResult {
  selector: string;
  found: boolean;
  record?: string;
}

interface CheckResult {
  domain: string;
  mx: {
    found: boolean;
    records: { exchange: string; priority: number }[];
    provider: string | null;
  };
  spf: {
    found: boolean;
    record: string | null;
    issues: string[];
    status: Status;
  };
  dkim: {
    selectorsChecked: number;
    found: DkimResult[];
    status: "ok" | "missing";
  };
  dmarc: {
    found: boolean;
    record: string | null;
    policy: string | null;
    subdomainPolicy: string | null;
    pct: number;
    enforcing: boolean;
    hasReporting: boolean;
    issues: string[];
    status: Status;
  };
  // Optional hardening — reported for visibility, deliberately not scored: a
  // domain without BIMI isn't insecure, it's just not decorated.
  mtaSts: SimpleRecordCheck;
  tlsRpt: SimpleRecordCheck;
  bimi: SimpleRecordCheck;
  fixes: SuggestedRecord[];
  summary: { score: number; verdict: string };
}

function isValidDomain(s: string): boolean {
  // Permissive: letters, digits, dots, hyphens. 2+ labels, each 1-63 chars.
  // Rejects obvious abuse (no IPs, no schemes, no paths).
  if (s.length > 253) return false;
  const re = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
  return re.test(s);
}

// Resolve a TXT lookup, distinguishing "no such record" (return null) from a
// transient resolver failure (throw) so a SERVFAIL/timeout never masquerades as
// a missing record and falsely tanks the score.
async function lookupTxt(host: string): Promise<string[][] | null> {
  try {
    return await dns.resolveTxt(host);
  } catch (err) {
    if (classifyDnsError(err) === "transient") throw err;
    return null;
  }
}

async function lookupMx(domain: string): Promise<{ exchange: string; priority: number }[] | null> {
  try {
    return (await dns.resolveMx(domain)).sort((a, b) => a.priority - b.priority);
  } catch (err) {
    if (classifyDnsError(err) === "transient") throw err;
    return null;
  }
}

// DKIM selector probe — best-effort. A non-existent selector (the common case)
// or any resolver hiccup is simply "not found"; a present TXT counts only when
// it's actually a DKIM key, not a stray record sitting at the probed name.
async function probeDkim(selector: string, domain: string): Promise<DkimResult> {
  try {
    const txt = await dns.resolveTxt(`${selector}._domainkey.${domain}`);
    const record = txt.map((parts) => parts.join("")).find(isDkimKeyRecord);
    return { selector, found: !!record, record };
  } catch {
    return { selector, found: false };
  }
}

function findSpf(txtRecords: string[][] | null): string | null {
  if (!txtRecords) return null;
  // SPF records may be split across multiple strings in a single TXT record.
  // Join the strings within each record, then find one starting with v=spf1.
  for (const parts of txtRecords) {
    const joined = parts.join("");
    if (/^v=spf1\b/i.test(joined)) return joined;
  }
  return null;
}

function analyzeSpf(record: string | null): { issues: string[]; status: "ok" | "warn" | "fail" | "missing" } {
  if (!record) {
    return {
      issues: ["No SPF record found. Mail from your domain has no sender-policy validation, which makes it easier to spoof."],
      status: "missing",
    };
  }
  const issues: string[] = [];
  let status: "ok" | "warn" | "fail" = "ok";

  if (/\+all\b/i.test(record)) {
    issues.push("Uses '+all' — allows any sender to claim to be your domain. This is the most dangerous SPF misconfiguration.");
    status = "fail";
  } else if (/\?all\b/i.test(record)) {
    issues.push("Ends with '?all' — neutral policy, neither asserts nor denies senders. Recommend '~all' or '-all'.");
    if (status === "ok") status = "warn";
  } else if (!/~all\b|-all\b/i.test(record)) {
    issues.push("No 'all' qualifier found at end of record. Recommend ending with '~all' (softfail) or '-all' (hardfail).");
    if (status === "ok") status = "warn";
  }

  // Count DNS lookups (each include:, a:, mx:, redirect=, exists: counts as 1).
  // SPF caps at 10 lookups; over that, validators return permerror.
  const lookupTerms = (record.match(/\b(include:|a[:\s]|mx[:\s]|redirect=|exists:|ptr[:\s])/gi) ?? []).length;
  if (lookupTerms > 10) {
    issues.push(`Contains ${lookupTerms} DNS lookups. SPF spec limits this to 10 — over the limit triggers a permerror and breaks validation.`);
    status = "fail";
  } else if (lookupTerms >= 8) {
    issues.push(`Contains ${lookupTerms} DNS lookups. Approaching the 10-lookup SPF limit. Consider consolidating includes.`);
    if (status === "ok") status = "warn";
  }

  return { issues, status };
}

function identifyProvider(mxRecords: { exchange: string }[]): string | null {
  for (const mx of mxRecords) {
    for (const p of MX_PROVIDERS) {
      if (p.match.test(mx.exchange)) return p.name;
    }
  }
  return null;
}

function computeSummary(result: Omit<CheckResult, "summary">): { score: number; verdict: string } {
  // Simple 0-100 score. Weighted: SPF 30, DKIM 20, DMARC 50 (DMARC is the
  // strongest signal since it requires SPF/DKIM alignment to work properly).
  let score = 0;

  if (result.spf.status === "ok") score += 30;
  else if (result.spf.status === "warn") score += 15;
  else if (result.spf.status === "fail") score += 5;

  if (result.dkim.status === "ok") score += 20;

  if (result.dmarc.status === "ok") score += 50;
  else if (result.dmarc.status === "warn") score += 25;
  else if (result.dmarc.status === "fail") score += 10;

  let verdict: string;
  if (score >= 90) verdict = "Strong. Email authentication is properly configured.";
  else if (score >= 60) verdict = "Functional but improvable. Some real gaps that affect deliverability or spoofing protection.";
  else if (score >= 30) verdict = "Significant gaps. Your domain is more spoofable than it should be, and major mail providers may filter you.";
  else verdict = "Largely unprotected. Email auth is mostly absent — your domain is highly spoofable.";

  return { score, verdict };
}

export async function POST(request: NextRequest) {
  // Rate-limit per IP — DNS lookups are cheap but we don't want to be used
  // as a free DNS-probing service. 20 checks per 10 minutes per IP is plenty
  // for a real user and curbs casual abuse.
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`dmarc-check:${ip}`, 20, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
    );
  }

  let body: { domain?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawInput = body.domain ?? "";
  // Hard length cap BEFORE any regex work — prevents polynomial-ReDoS on
  // pathological input. Real domains max out at 253 chars per RFC 1035;
  // we accept a little slack for the http:// / www. prefixes a user might paste.
  if (typeof rawInput !== "string" || rawInput.length > 270) {
    return NextResponse.json(
      { error: "That doesn't look like a valid domain. Enter something like 'yourbusiness.com'." },
      { status: 400 }
    );
  }
  const raw = rawInput.trim().toLowerCase();
  // Strip common prefixes a user might paste in.
  const domain = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");

  if (!isValidDomain(domain)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid domain. Enter something like 'yourbusiness.com'." },
      { status: 400 }
    );
  }

  // Core records first: a transient resolver failure here must surface as an
  // error, not as a false "everything is missing" verdict.
  let rootTxt: string[][] | null;
  let dmarcTxt: string[][] | null;
  let mxRecords: { exchange: string; priority: number }[] | null;
  let mtaStsTxt: string[][] | null;
  let tlsRptTxt: string[][] | null;
  let bimiTxt: string[][] | null;
  try {
    [rootTxt, dmarcTxt, mxRecords, mtaStsTxt, tlsRptTxt, bimiTxt] = await Promise.all([
      lookupTxt(domain),
      lookupTxt(`_dmarc.${domain}`),
      lookupMx(domain),
      lookupTxt(`_mta-sts.${domain}`),
      lookupTxt(`_smtp._tls.${domain}`),
      lookupTxt(`default._bimi.${domain}`),
    ]);
  } catch {
    return NextResponse.json(
      { error: "Couldn't complete the DNS lookup right now. Please try again in a moment." },
      { status: 503 }
    );
  }

  // DKIM selector probes are best-effort and never fail the whole request.
  // Bounded concurrency so one HTTP request can't fan out into ~45 simultaneous
  // DNS queries — amplification against the probed domain and pressure on our
  // own resolver / file descriptors.
  const dkimResults: DkimResult[] = [];
  for (let i = 0; i < DKIM_SELECTORS.length; i += 8) {
    const batch = DKIM_SELECTORS.slice(i, i + 8);
    dkimResults.push(...(await Promise.all(batch.map((s) => probeDkim(s, domain)))));
  }

  const spfRecord = findSpf(rootTxt);
  const spf = { record: spfRecord, ...analyzeSpf(spfRecord) };

  const dmarc = analyzeDmarc(findDmarcRecords(dmarcTxt));
  const mtaSts = analyzeMtaSts(mtaStsTxt);
  const tlsRpt = analyzeTlsRpt(tlsRptTxt);
  const bimi = analyzeBimi(bimiTxt);

  const dkimFound = dkimResults.filter((r) => r.found);
  const provider = mxRecords ? identifyProvider(mxRecords) : null;

  const result: Omit<CheckResult, "summary"> = {
    domain,
    mx: {
      found: !!mxRecords && mxRecords.length > 0,
      records: mxRecords ?? [],
      provider,
    },
    spf: {
      found: !!spfRecord,
      record: spfRecord,
      issues: spf.issues,
      status: spf.status,
    },
    dkim: {
      selectorsChecked: DKIM_SELECTORS.length,
      found: dkimFound,
      status: dkimFound.length >= 1 ? "ok" : "missing",
    },
    dmarc: {
      found: !!dmarc.record,
      record: dmarc.record,
      policy: dmarc.policy,
      subdomainPolicy: dmarc.subdomainPolicy,
      pct: dmarc.pct,
      enforcing: dmarc.enforcing,
      hasReporting: dmarc.hasReporting,
      issues: dmarc.issues,
      status: dmarc.status,
    },
    mtaSts,
    tlsRpt,
    bimi,
    fixes: suggestedRecords({
      domain,
      provider,
      spfRecord,
      spfStatus: spf.status,
      dmarc,
      mtaSts,
      tlsRpt,
    }),
  };

  const summary = computeSummary(result);

  return NextResponse.json({ ...result, summary } satisfies CheckResult);
}
