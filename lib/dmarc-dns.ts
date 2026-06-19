// lib/dmarc-dns.ts
// Pure DNS-record classification helpers for the email-auth checker. Kept out of
// the route handler so they can be unit-tested without performing live DNS.

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
