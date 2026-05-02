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

## 2026-04-23 — Build-time prisma noise from settings reads

`next build` runs sitemap/layout/analytics at build time without DB access. Try/catch fallbacks work (empty arrays, no analytics tags) but Prisma logs `prisma:error` to stderr for each failed query. Build succeeds; logs are noisy. Acceptable for now. If it masks real errors later, gate DB calls on `process.env.NEXT_RUNTIME === "nodejs"` or skip during build via a custom env flag.

---

## How to add to this file

When you finish a task and a real lesson emerged, add an entry. Keep it terse. The point is to avoid repeating the mistake — not to write an essay. If the lesson is big enough to drive an architectural change, it goes in `docs/DECISIONS.md` instead. If it's about how the codebase works, update `CLAUDE.md`. If it's about how *we* work — it lives here.
