// scripts/audit-check.mjs
// CI gate over `npm audit` for production deps. Fails on any high/critical
// advisory EXCEPT a small allowlist of triaged, no-fix-available advisories
// (documented in CLAUDE.md "Known Issues"). This keeps the gate meaningful — a
// new, unrelated high/critical vuln still fails the build — without it being
// permanently red over transitive advisories we cannot patch (nodemailer is
// pinned to 7 by next-auth's @auth/core peer dependency).
//
// Usage (see .github/workflows/ci.yml):
//   npm audit --json --omit=dev > npm-audit.json || true
//   node scripts/audit-check.mjs npm-audit.json

import { readFileSync } from "node:fs";

// Each entry is accepted because the vulnerable code path is unreachable given
// how server/email/index.ts uses nodemailer: sendEmail() accepts only the
// EmailPayload allowlist (from/to/subject/html/text/replyTo) and the transport
// sets only host/port/secure/auth{user,pass}. Re-triage if EmailPayload or the
// transport options ever widen.
const ALLOW = new Map([
  ["GHSA-c7w3-x93f-qmm8", "nodemailer envelope.size injection — we never set envelope"],
  ["GHSA-vvjj-xcjg-gr5g", "nodemailer transport name CRLF — we never set name"],
  ["GHSA-268h-hp4c-crq3", "nodemailer List-* header CRLF — we never set headers/list"],
  ["GHSA-wqvq-jvpq-h66f", "nodemailer jsonTransport bypass — SMTP transport only"],
  ["GHSA-r7g4-qg5f-qqm2", "nodemailer OAuth2 TLS — we use auth:{user,pass}, not OAuth2"],
  ["GHSA-p6gq-j5cr-w38f", "nodemailer raw option file-read/SSRF — not in EmailPayload"],
  ["GHSA-qx2v-qp2m-jg93", "postcss stringify XSS — transitive via Next; no untrusted input"],
]);

const BLOCK = new Set(["high", "critical"]);

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/audit-check.mjs <npm-audit.json>");
  process.exit(2);
}

let report;
try {
  report = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`audit-check: could not read/parse ${file}: ${e.message}`);
  process.exit(2);
}

const ghsaFromUrl = (url) => (typeof url === "string" ? url.split("/").pop() : "");

const offenders = new Set();
const accepted = new Set();
for (const v of Object.values(report.vulnerabilities ?? {})) {
  for (const via of v.via ?? []) {
    if (typeof via !== "object" || via === null) continue; // string = dep path, not an advisory
    if (!BLOCK.has(via.severity)) continue;
    const ghsa = ghsaFromUrl(via.url);
    if (ALLOW.has(ghsa)) accepted.add(`${ghsa} (${via.severity})`);
    else offenders.add(`${(via.severity || "?").toUpperCase()}  ${via.title ?? ghsa ?? "unknown"}  ${via.url ?? ""}`);
  }
}

if (accepted.size) {
  console.log(`audit-check: ignoring ${accepted.size} allowlisted high/critical advisory(ies): ${[...accepted].join(", ")}`);
}

if (offenders.size) {
  console.error(`audit-check: ${offenders.size} high/critical advisory(ies) NOT on the allowlist:`);
  for (const o of offenders) console.error("  " + o);
  console.error("Triage, then either fix or add to the allowlist in scripts/audit-check.mjs with a documented reason.");
  process.exit(1);
}

console.log("audit-check: no unallowlisted high/critical advisories. OK.");
