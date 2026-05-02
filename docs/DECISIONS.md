# Architectural Decisions

Append-only log. Each entry: date, decision, why, and what alternatives were considered. Read this before questioning existing design choices.

---

### 2026-04-07: Cron routes instead of a job queue

**Decision:** Background jobs (email processing, appointment reminders, overdue invoice flagging) use Next.js API routes called by external cron, not a persistent queue processor (Bull, BullMQ, etc.).

**Why:** Single-instance VPS deployment. No Redis. No persistent worker process to manage. Cron routes are stateless, restart-safe, and can be called by any scheduler (systemd timer, external cron service, Docker healthcheck). The EmailQueue table IS the queue — the cron route processes it.

**Trade-off:** No real-time processing — emails wait up to the cron interval. Acceptable for a consultancy with <50 clients. If volume grows, add Redis + BullMQ later.

---

### 2026-04-07: Nodemailer singleton instead of transactional email service

**Decision:** Email sent via Nodemailer with SMTP credentials stored in the Settings table. Singleton transport initialized once per process.

**Why:** Zero vendor dependency. SMTP works with any provider (Gmail, Fastmail, Postmark, SES). The Settings table means SMTP config can be changed at runtime without redeployment. Fire-and-forget pattern (`.catch(() => {})`) means email failures don't block mutations.

**Trade-off:** No delivery tracking, no bounce handling, no open/click metrics. Acceptable pre-revenue. Switch to Postmark or SES when delivery reliability matters.

---

### 2026-04-07: Local file storage instead of S3

**Decision:** Files stored on local disk at `UPLOAD_DIR/{yyyy-mm}/{randomHex}-{safeName}`. Served via authenticated API route.

**Why:** Zero vendor dependency during development. No AWS credentials to manage. Files are served through `/api/files/[id]` which enforces auth — no public URL leakage.

**Trade-off:** Files don't survive server loss. No CDN. Not scalable beyond single instance. S3 backend is Phase 4 (ROADMAP 4.7). When switching, only `server/storage/local.ts` needs replacement — the API routes stay the same.

---

### 2026-04-07: Settings as DB key/value instead of config file

**Decision:** Runtime settings (company name, SMTP host, invoice prefix, etc.) stored as key/value rows in the Setting model, not in `.env` or a config file.

**Why:** Settings can be changed via the admin UI without redeployment. New settings don't require schema migrations — just add a new key. The `isSecret` flag controls whether values are masked in the API response.

**Trade-off:** Requires a DB query to read any setting. Acceptable — these are rarely read per-request and Prisma caches connections.

---

### 2026-04-07: Fire-and-forget email pattern

**Decision:** All email sends in mutations use `sendEmail({...}).catch(() => {})` — non-blocking, no error propagation.

**Why:** Email delivery should never block a user action. If a ticket is submitted, the ticket exists regardless of whether the confirmation email sends. The EmailQueue cron route handles retries for queued emails. Direct sends (ticket confirmation, password reset) are best-effort.

**Trade-off:** Silent email failures. Mitigated by the EmailQueue processor for important emails. For direct sends, the user sees the success state even if the email fails.

---

### 2026-04-07: Client portal uses cuid tokens, not auth sessions

**Decision:** Client portal access via `/portal/[token]` where token is a cuid stored on the Client model. No login required.

**Why:** Clients shouldn't need accounts to view their invoices or tickets. The token is sent in emails (portal link). Authorization happens in each portal page's server component — DB lookup by token with `notFound()` on miss. Middleware no longer validates tokens (the UUID regex check was removed in 2026-04-14 because tokens are CUIDs, not UUIDs).

**Known issue:** Tokens never expire and can't be rotated without DB intervention. This is documented in Known Issues. Rotation mechanism needed before handling sensitive data.

---

### 2026-04-07: Anti-enumeration on password reset

**Decision:** `requestPasswordReset` always returns `{ ok: true }` regardless of whether the email exists in the system.

**Why:** Prevents attackers from discovering valid email addresses by observing different responses. The actual token generation and email send only happen if the user exists, but the response is identical either way.

---

### 2026-04-14: Public ticket reply as API route, not tRPC

**Decision:** Client replies to tickets from the public tracking page go through `POST /api/tickets/reply` (a Next.js API route), not a tRPC procedure.

**Why:** The tracking page is a public server-rendered page. Adding tRPC client-side infrastructure (provider, hooks) to a page that only needs one POST request is unnecessary complexity. A simple `fetch()` call to an API route is lighter. Rate limiting is applied directly in the route handler.

**Trade-off:** No tRPC type safety on the client side. Acceptable for a single form submission.

---

### 2026-04-14: In-memory rate limiting

**Decision:** `server/rate-limit.ts` uses a plain `Map` keyed by IP + action, with sliding window timestamps.

**Why:** Zero dependencies. No Redis. Works for single-instance deployment. The Map is process-scoped — survives request-to-request but clears on restart.

**Known issue:** Doesn't work across multiple instances. Resets on deploy. Acceptable for single-VPS architecture. Switch to Redis-backed rate limiting if horizontal scaling happens.

---

### 2026-04-14: Session discipline system

**Decision:** Created `/boot` skill, session discipline rules in CLAUDE.md, decision log (this file), expanded known issues, and memory files for security posture and session behavior.

**Why:** Context loss between Claude sessions was causing repeated re-discovery of the same information, stale memory files contradicting reality, and design decisions evaporating. The `/boot` checklist forces context loading. The decision log preserves "why." The session discipline rules enforce doc updates inline with work, not as a separate step that gets skipped when context runs out.

---

### 2026-04-16: Post-mortem — Zod runtime constraints not caught by TypeScript

**What happened:** Time tracking and Orders pages both crashed with a server error. Both called `crm.listClients({ page: 1, limit: 200 })`. The `listClients` Zod schema has `limit: z.number().int().min(1).max(100)`. Zod rejected `200` at runtime, throwing a validation error.

**Why TypeScript didn't catch it:** tRPC infers Zod schema types as their base TypeScript type. `z.number().max(100)` infers as `number`, not `number & { max: 100 }`. TypeScript sees `limit: 200` as valid `number` — no error. The constraint only exists at runtime in Zod's validation.

**Root cause:** The page was written without reading the router's input schema. The caller assumed a higher limit was fine.

**Lesson:** Before calling any tRPC procedure from a server component, open the router file and read the `.input()` block. Check every `.min()`, `.max()`, `.regex()`, enum constraint, and optionality. This is now an engineering standard in CLAUDE.md.

**Broader pattern:** Any boundary between two systems where one side has stricter validation than the type system can express is a bug factory. tRPC callers + Zod schemas is the specific instance here, but the principle applies to API routes, form submissions, and anything with runtime validation.

---

### 2026-04-23: Repo stays public; strategic playbook lives in `~/.claude/plans/`

**Decision:** Repository remains public on GitHub. SECURITY.md added at root. README rewritten to clarify what's in this repo vs. what isn't.

**Why:** The brand promise is transparency. Going private contradicts it. Audit confirmed no committed secrets, no customer data in seeds, no real client info anywhere. The strategic growth playbook (pricing experiments, hiring sequence, customer segmentation, market sizing) lives in `~/.claude/plans/async-foraging-quill.md` outside the repo.

**Audit finding:** `docs/ROADMAP.md` was originally flagged for moving private. Review showed it's a build status table (which features are working) — not strategic content. Kept public.

**Doc classification rule:** Technical (architecture, decisions, lessons, build status, deployment): public. Strategic (growth playbook, pricing experiments, hiring sequence, customer artifacts): private, lives outside the repo.

---

### 2026-04-23: Branch protection on `main` enabled (Option 2 — moderate)

**Decision:** Branch protection rule applied to `main` via the GitHub REST API.

**Settings:**
- Require pull request before merging (admin can bypass)
- Required status checks: `Lint, type-check, test`, `Secret scan (gitleaks)`, `Dependency audit (npm)`
- Strict mode (branch must be up-to-date with main before merging)
- No force pushes, no branch deletion
- Require conversation resolution before merge
- 0 required reviews (solo developer; raise to 1 when collaborators join)
- `enforce_admins: false` — admin can override in emergencies

**Why not Option 3 (full strict, all five scanners required):** CodeQL and Semgrep haven't completed a first run yet. Adding them as required before the contexts exist would block PRs without recourse. Add them once their first run is clean and any pre-existing findings are triaged.

**Update (same day):** First runs completed clean (after fixing 2 Semgrep findings — Dockerfile root user + json-ld nosemgrep with rationale). Added `Analyze (javascript-typescript)` (CodeQL) and `Scan` (Semgrep) to required checks. Now five required checks total. Admin bypass still allowed.

**Workflow change:** direct pushes to `main` will be blocked; future work uses PRs. Hotfixes can use admin-bypass when truly time-critical.
