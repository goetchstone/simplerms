// scripts/audit-check.mjs
// CI gate over `npm audit` for production deps. Fails on any high/critical
// advisory EXCEPT a small allowlist of triaged, no-fix-available advisories
// (documented in CLAUDE.md "Known Issues"). This keeps the gate meaningful — a
// new, unrelated high/critical vuln still fails the build — without it being
// permanently red over a transitive advisory we cannot patch without
// downgrading a framework (currently only postcss, bundled by Next.js).
//
// Usage (see .github/workflows/ci.yml):
//   npm audit --json --omit=dev > npm-audit.json || true
//   node scripts/audit-check.mjs npm-audit.json

import { readFileSync } from "node:fs";

// Each entry must be a triaged, no-fix-available advisory that is unreachable
// through our application surface. Shrink as fixes land. (The nodemailer cluster
// was removed once nodemailer 9 patched it — see package.json `overrides`.)
const ALLOW = new Map([
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
