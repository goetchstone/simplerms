# Lessons Learned

Append-only log of small lessons that don't fit neatly in CLAUDE.md (operating constraints) or DECISIONS.md (architectural decisions). This is the "things we keep getting wrong" file.

Read at session start (loaded by `/boot`). Add to it whenever:
- A user pushes back on something we just shipped
- A bug is found that a different working pattern would have prevented
- A decision is reversed
- A small constraint is discovered that future sessions need to know
- We realize a doc was stale or contradicted reality

**Format for each entry:**
- Date — short title
- What happened (1–2 sentences)
- The lesson (1 sentence)
- Where it applies (file paths or contexts)

---

## 2026-04-23 — Plan-mode pushback is signal, not noise

**What happened:** Approved a plan that recommended deleting the `/careers` page entirely. User pushed back: "we can keep a careers page, we just don't need the hiring plan or roadmap public." The original removal would have stripped a useful trust signal (real company that hires) along with the strategic leak.

**Lesson:** When a user pushes back on a plan item, the right move is to find the narrower change that addresses the actual concern — not to revert wholesale or double down on the original proposal.

**Where it applies:** Any time we're about to delete a feature/page/file because the agent flagged it as low-value. Ask: is the value zero, or is the value mixed with a separable concern we can strip?

---

## 2026-04-23 — Suggested security stack should not be the only stack

**What happened:** Plan recommended Dependabot + CodeQL + gitleaks + npm audit. User asked "I don't see semgrep or other tools listed here." Semgrep was deliberately excluded by the recommendation but it's a genuinely complementary tool (pattern-based rules vs CodeQL's dataflow analysis), free, fast, and widely used.

**Lesson:** When recommending a curated subset of an ecosystem (security scanners, analytics providers, MDMs), explicitly call out the notable tools that were considered and skipped, with the reason. Otherwise the user has to ask "what about X?" and the conversation goes a round trip.

**Where it applies:** Any "stack chosen" or "we recommend X" decision. Pattern: "Chose A, B, C. Considered and skipped: D (reason), E (reason)."

---

## 2026-04-23 — Idempotent seeds need pinned dates, not `new Date()`

**What happened:** Blog seed scripts used `publishedAt: new Date()` in both `update` and `create` blocks. Once `deploy.sh` started running them on every deploy, every blog post's publish date got reset to "now" on each deploy.

**Lesson:** Anything in an `upsert` that should be set-once must be a literal value (ISO date string, hardcoded boolean, etc.), not a function call that re-evaluates per run. The `update` block runs every time the upsert matches an existing row.

**Where it applies:** Every upsert in `prisma/seed*.ts`. Every "set on create only" field — `publishedAt`, `createdAt` overrides, default tokens that shouldn't rotate.

---

## 2026-04-23 — Profiled Docker services need explicit `--profile` on every command

**What happened:** The `migrator` service in docker-compose.yml has `profiles: [tools]`. The deploy script ran `$COMPOSE build --no-cache` which silently skipped it. As a result the migrator image stayed pinned to whatever version was built when it was first created — missing every new file (including a new blog seed) added since.

**Lesson:** With Docker Compose profiles, the profile flag is required for *every* command that should include the profiled service: `build`, `up`, `run`. Without it, Compose silently excludes the service and you get a stale image that "works" until it suddenly references something it doesn't have.

**Where it applies:** Every line in `deploy.sh` that touches the migrator. Documented in CLAUDE.md.

---

## 2026-04-23 — Hardcoded args to functions with sensible defaults are a hazard

**What happened:** `formatCurrency(s.price, "CAD")` was used on the booking page. The function defaults to USD if you don't pass anything. The "CAD" was hallucinated by an earlier session — there was no Canadian-dollar requirement anywhere in the project. Production users saw prices as Canadian dollars for weeks.

**Lesson:** When calling a function that has a sensible default, prefer the default unless you have a specific reason to override. An explicit override of a default reads as "we considered this and chose differently" — which means the default better be wrong.

**Where it applies:** Any utility function with default args. `formatCurrency`, `format` (date), pagination defaults, etc.

---

## 2026-04-23 — Zod runtime constraints don't propagate to TS

**What happened:** Two dashboard pages crashed with server errors because they passed `limit: 200` to `caller.crm.listClients(...)`. The procedure's Zod schema has `limit: z.number().int().min(1).max(100)`. TypeScript saw `limit: number` and was happy. Zod rejected at runtime.

**Lesson:** Before calling any tRPC procedure from server-side code, open the router file and read the `.input()` block. TypeScript only enforces the base type. Any `.min()`, `.max()`, `.regex()`, `.refine()`, or enum constraint will only fire at runtime.

**Where it applies:** Every tRPC call from a server component or API route. Codified in CLAUDE.md as an Engineering Standard.

---

## 2026-04-23 — Public page checklist has 4 items, not 3

**What happened:** The `/careers` page was created with proxy.ts + RESERVED + sitemap.ts updates. The footer link was forgotten — and so was the corresponding footer-cleanup later. Caused two follow-up commits.

**Lesson:** Public pages have a 4-step checklist: proxy.ts PUBLIC_PATHS, [slug]/page.tsx RESERVED, sitemap.ts entry, site-footer.tsx link. Miss any one and the page either 404s, isn't crawlable, isn't reachable, or all of the above.

**Where it applies:** Adding or removing any public page. Codified in CLAUDE.md.

---

## 2026-04-23 — SDK bumps with API version contracts can't auto-merge

**What happened:** Dependabot bumped Stripe v21 → v22 in a prod-deps group. The bump itself was clean, but the SDK enforces a typed `apiVersion` string at the call site (`new Stripe(key, { apiVersion: "2026-03-25.dahlia" })`). The new SDK requires `"2026-04-22.dahlia"` — a string Dependabot doesn't know to update. Type check failed; PR was misleadingly labeled "type-check failure."

**Lesson:** Major-version bumps on SDKs that pin API version strings (Stripe, Twilio, AWS SDKs, Auth0, Anthropic) need a paired manual code change. Dependabot is invisible to that. Either pin major bumps and do them manually, or push the version-string fix directly onto Dependabot's branch when the bump happens.

**Where it applies:** Any `dependabot.yml` covering SDKs with versioned APIs. Consider adding `ignore` rules for major bumps on these specifically.

---

## 2026-04-23 — Iterate the framing before building, not after

**What happened:** User asked to "promote ownership over Apple Business." Took 4 exchanges to land on the actual sharp version: "own the keys to move." Drafts in between ranged from too broad ("own your stack" — sounded like self-hosting) to too combative ("MSPs are parasites" — overstates the case).

**Lesson:** When the user gives a strategic-direction instruction, the first phrasing is rarely the final phrasing. Iterate copy/framing with them BEFORE writing files. Three or four exchanges that sharpen the language cost minutes; the wrong copy in production costs days to undo. Use AskUserQuestion early to surface the alternatives, then refine the chosen one in plain conversation.

**Where it applies:** Any positioning, copy, naming, or strategic-deliverable conversation. Especially when the first idea sounds powerful but might overstate or under-specify.

---

## 2026-04-23 — Dependabot doesn't know about peer-dep conflicts

**What happened:** Dependabot opened PRs to bump nodemailer 7 → 8 (and a prod-deps group containing the same bump). Both failed `npm ci` with ERESOLVE: next-auth 5 peer-deps `nodemailer@^7.0.7`. CI showed it as "Lint, type-check, test failed" — misleading; the failure was at install, not at type-check.

**Lesson:** When a Dependabot PR fails at install with ERESOLVE on a major bump, don't force it through (`--legacy-peer-deps` hides real breakage). Pin the dep at its current major in `dependabot.yml` until the peer/dependent catches up. Document the pin so the next session knows when to revisit.

**When to revisit:** when next-auth 5 stable lists nodemailer@^8 as supported. Check at https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/package.json

---

## 2026-04-23 — Don't use `status` as a bash variable name

**What happened:** Built a Monitor script polling CI runs; used `status` as a local variable. Failed with `read-only variable: status` because zsh treats it as reserved.

**Lesson:** When writing bash/zsh scripts (especially in Monitor and deploy.sh), avoid these reserved-or-magic names: `status`, `path`, `cdpath`, `argv`, `signals`, `pipestatus`. Use `state`, `result`, `cur`, etc. Quick portable test before running: `bash -n script.sh && zsh -n script.sh`.

---

## 2026-04-23 — Tool parameter mixing (Write vs Edit) — RECURRING

**What happened (3 times today):** Tried to combine `Write` with `replace_all`/`old_string`/`new_string` in single calls. Worst case: I wrote a route handler's CONTENT to `proxy.ts` (overwriting it) because the Write was at proxy.ts's path with Edit-style intent. Restored from git.

**The rule, sharper:**
- `Write` = `file_path` + `content`. Always overwrites the WHOLE file. Nothing else allowed.
- `Edit` = `file_path` + `old_string` + `new_string` (+ optional `replace_all`). Patches a region.
- **Never both in one call.** When tempted to "create a file AND patch another in the same tool call" — that's two tool calls, not one.

**Trigger before every Write call:** ask "is the path I'm writing to a file I want to OVERWRITE entirely?" If no, use Edit. If the file exists with content I want to preserve, use Edit.

**Where it applies:** Every Write call in every session. The cost of getting this wrong is silently destroying a file. `git checkout <file>` recovers IF the file was committed; if it was uncommitted work, it's gone.

---

## 2026-04-23 — Day 1 of Semgrep caught 2 real signals, both addressable

**What happened:** First Semgrep run on `main` blocked with 2 findings: (1) Dockerfile `development` stage ran as root, (2) `dangerouslySetInnerHTML` in `components/site/json-ld.tsx`.

**Triage:**
- Dockerfile root: real but low-impact (dev stage isn't used in prod). Fixed by adding `USER node`.
- json-ld dangerouslySetInnerHTML: false positive for our use case. JSON-LD is the canonical Next.js pattern; data is server-built from controlled inputs, not user input. Suppressed with `// nosemgrep` and inline rationale on the line above.

**Lesson:** Semgrep's default rules earn their keep on day one. False positives exist but are rare; suppress with a documented reason on the violating line, never repo-wide. Keep the suppression specific (rule ID, not blanket).

---

## 2026-04-23 — Triage before enforce (CI security scanners)

**What happened:** Wired up Dependabot/CodeQL/Semgrep/gitleaks/npm audit and was about to enable required-status-checks. Ran `npm audit --audit-level=high --omit=dev` first — caught a high-severity Next.js DoS advisory (GHSA-q4gf-8mx6-v5v3). Bumped Next 16.2.1 → 16.2.4, audit cleared. Only then committed the workflows.

**Lesson:** When adding a new gating scan, run it locally first and triage findings BEFORE pushing. Otherwise the first PR after enforcement is blocked and you lose the day to fixing pre-existing issues you should have known about.

**Where it applies:** Every new scanner. Documented in `docs/SECURITY-CI.md` under "Branch protection on `main`."

---

## 2026-04-23 — Build-time prisma noise from settings reads

`next build` runs sitemap/layout/analytics at build time without DB access. Try/catch fallbacks work (empty arrays, no analytics tags) but Prisma logs `prisma:error` to stderr for each failed query. Build succeeds; logs are noisy. Acceptable for now. If it masks real errors later, gate DB calls on `process.env.NEXT_RUNTIME === "nodejs"` or skip during build via a custom env flag.

---

## How to add to this file

When you finish a task and a real lesson emerged, add an entry. Keep it terse. The point is to avoid repeating the mistake — not to write an essay. If the lesson is big enough to drive an architectural change, it goes in `docs/DECISIONS.md` instead. If it's about how the codebase works, update `CLAUDE.md`. If it's about how *we* work — it lives here.
