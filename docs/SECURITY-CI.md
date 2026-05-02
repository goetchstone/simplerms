# CI Security Stack — Operator Notes

What scans run, what they catch, how to enable gating, and how to triage findings.

## Scanners running

| Scanner | What it catches | Cost | Where findings appear |
|---------|-----------------|------|----------------------|
| **Dependabot** | CVEs in npm + GitHub Actions deps | Free | Pull Requests (auto-opened) |
| **CodeQL** | Dataflow taint (SQL injection, XSS, prototype pollution) | Free for public repos | Security tab → Code scanning |
| **Semgrep** | Pattern-based rules (OWASP Top 10, framework misuse, dangerous APIs) | Free community ruleset | Security tab → Code scanning (via SARIF) |
| **gitleaks** | Committed secrets (API keys, tokens, private keys) | Free OSS | CI workflow output + PR check |
| **npm audit** | Known CVEs in installed dependencies | Free, built-in | CI workflow output (`high+` severity gates merge) |
| **GitHub native secret scanning** | Leaked credentials patterns from 100+ providers | Free for public repos | Security tab → Secret scanning |

## Enable GitHub native secret scanning (one-time)

Settings → Code security & analysis → enable:
- Dependabot alerts ✓
- Dependabot security updates ✓
- Secret scanning ✓
- Push protection ✓ (blocks pushes containing detected secrets)

## Branch protection on `main` (must-pass gating)

The scans are running. To make them gate (block merge on failure):

1. Settings → Branches → Add branch protection rule
2. Branch name pattern: `main`
3. Enable:
   - Require a pull request before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
4. Required checks (add these by name as they appear after the first CI run):
   - `Lint, type-check, test`
   - `Build` (part of test job)
   - `Secret scan (gitleaks)`
   - `Dependency audit (npm)`
   - `Analyze (javascript-typescript)` (CodeQL)
   - `Scan` (Semgrep)
5. Enable: Do not allow bypassing the above settings (no admin override)
6. Save

**Don't enable until the first run of each scanner has been triaged** — otherwise pre-existing findings will block your first PR after enforcement.

## Triage workflow when a scan fires

1. Read the finding. Don't dismiss reflexively.
2. **Real vulnerability?** → fix in the next commit
3. **False positive?** → dismiss in the Security tab with the reason. Don't suppress at the rule level unless it's repeatedly noisy.
4. **Acceptable risk?** → document in `docs/DECISIONS.md` with the rationale. Re-evaluate quarterly.
5. **CVE in dep with no patch?** → check Dependabot weekly; if a fix doesn't land in ~30 days, evaluate replacing the dep

## When a scanner stops earning its keep

If a scanner produces only noise for 90+ days (no real findings, only false positives or dismissed findings), consider:
- Tightening its ruleset
- Removing it entirely

A scanner that fires often without value trains the team to ignore findings — that's worse than not running it.

## Running scans locally before pushing

```bash
# Secret scan
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest detect --source=/repo --no-git

# Dependency audit (production deps, high+)
npm audit --audit-level=high --omit=dev

# Semgrep (default ruleset)
docker run --rm -v "$PWD:/src" semgrep/semgrep semgrep --config p/javascript --config p/owasp-top-ten /src
```

CodeQL is harder to run locally; rely on CI for that one.
