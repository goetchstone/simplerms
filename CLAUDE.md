# CLAUDE.md

## Core Philosophy

KISS. Simplicity and elegance above all else.

Do it right. No shortcuts, no hacks, no "we'll fix it later." Every commit is production-ready and deployable.

**Quality, security, maintainability, and usability all carry the same weight.** A beautiful UI on insecure code is unacceptable. A secure system nobody can use is unacceptable. Clean code that breaks under load is unacceptable. The job is to hold all four — not trade one for another.

## Code Quality

- Every file starts with its path as a comment on line 1
- Comments explain *why*, never *what* — no restating the obvious
- No AI tells — no boilerplate filler, no "this function does X" noise
- Small functions, single responsibility, clear naming
- No dead code, no commented-out code, no TODOs left behind
- Consistent formatting — follow existing patterns exactly

## Comment & Commit Discipline

Comments and commits are for the next reader, not the current author. Strip everything that isn't relevant.

**Code comments:**
- Explain why a non-obvious choice was made — not what the code does
- One sentence. Two if the why is genuinely two-part.
- No conversation context. No "we tried X then Y." If that history matters, it goes in `docs/LESSONS.md`.
- No "TODO" without a tracking issue. Either fix it or open an issue.

**Commit messages:**
- Subject line: ≤50 chars, imperative ("fix login redirect" not "fixed login redirect")
- Body (only when needed): the WHY in 1–3 short lines, ≤72 char wrap
- No paragraphs explaining the change in detail — `git diff` shows the change
- No "Co-Authored-By" attribution unless the user asks for it

**Anti-pattern (don't do this):**
```
fix: portal middleware UUID/CUID mismatch causing all unauthenticated portal access to redirect

Root cause: proxy.ts validated tokens as UUID format (`8-4-4-4-12` hex) but
`portalToken` uses `@default(cuid())` which produces alphanumeric strings.
Also checked query params but portal uses path segments. Fixed by adding
`/portal` to PUBLIC_PATHS and removing the broken middleware block entirely.
```

**Right pattern:**
```
fix: allow public portal access (CUID, not UUID)

Middleware regex blocked all CUID tokens; tokens are CUIDs, not UUIDs.
```

## Engineering Standards

- Never break the build — run tests before committing
- Handle errors explicitly — no silent failures, no swallowed exceptions
- Validate at system boundaries, trust internals
- **Callers must respect callee constraints.** Before calling any tRPC procedure, read its Zod input schema — check `.min()`, `.max()`, `.regex()`, enums, and optionality. TypeScript erases Zod runtime constraints (e.g., `z.number().max(100)` types as `number`), so the compiler won't save you. This caused a production crash (limit: 200 vs max: 100).
- No premature abstraction — earn complexity through repetition
- Minimal dependencies — every dependency is a liability
- Security by default — no hardcoded secrets, no injection vectors, sanitize inputs
- Idempotent operations where possible
- Logging that tells you what happened, not that something happened
- Name things precisely — if you can't name it clearly, you don't understand it

## Security

Security is not optional. No shortcuts, no "fix it later." Every commit must be defensible.

- Sanitize all user input at system boundaries (tRPC input schemas, API route bodies, query params)
- Rate limit all public endpoints — no exceptions
- Never trust client-side validation alone — always validate server-side
- No IDOR — verify ownership/authorization before returning or mutating any resource
- Auth on every protected route — `auth()` or tRPC `protectedProcedure` minimum
- File uploads: whitelist types (not blacklist), validate size, randomize filenames, serve via authenticated route
- Stripe webhooks: always verify signatures before processing
- Tokens: cryptographically random, enforce expiry, delete after use
- XSS: escape HTML in email templates, rely on React's built-in escaping for UI
- When you see an attack surface: stop and protect it before moving on. Document the protection in a comment explaining the attack vector.

## Process

- Small, focused commits with clear messages
- Read before you write — understand existing code before changing it
- Delete more code than you add when possible
- If a fix is ugly, the design is wrong — fix the design
- Measure before optimizing — no speculative performance work

## Session Discipline

- Run `/boot` at the start of every session. No exceptions.
- Update docs as you work, not at the end — sessions die mid-context, so batched updates never happen.
- After completing a feature: update `docs/ROADMAP.md` status table
- After making a non-obvious design choice: append to `docs/DECISIONS.md`
- After hitting a bug or gotcha: add to Known Issues below
- After touching a feature: update its `docs/features/*.md` spec if "Current State" is wrong
- Before committing, ask: "Did I learn anything that the next session needs to know?" If yes, write it down.
- See `docs/DECISIONS.md` for architectural rationale — read before questioning existing design choices

## Project: SimpleRMS / Akritos

This is a combined RMS (Resource Management System) backend + marketing site for Akritos Technology Partners, LLC — an Apple/MDM IT consultancy based in Connecticut.

### Business Context

- **Niche:** Apple MDM & Mac management for SMBs with Windows-native IT teams
- **Brand story:** "Akritos" = Ancient Greek ἄκριτος, meaning "unwatered" — full strength, undiluted wine. No watered-down IT.
- **Founder:** Goetch Stone — 20+ years IT, Director of IT at multi-location retailer, PSU MacAdmins 2025 workshop instructor
- **Business status:** LLC registered, EIN obtained, fully insured ($1M/$2M E&O+GL) — all as of April 2026
- **Pre-revenue:** Zero clients. Site, brand, and platform are built. Next: bank account, Google Business Profile, first client outreach.

### Architecture

- See `docs/ARCHITECTURE.md` for full stack details, directory structure, and design system
- See `docs/ROADMAP.md` for build priorities and current status
- Feature specs live in `docs/features/` — read the relevant doc before building

### Key Patterns

- **tRPC hierarchy:** publicProcedure → protectedProcedure → staffProcedure → adminProcedure
- **tRPC caller constraint:** When calling procedures from server components, always verify the Zod input schema's runtime constraints (min, max, regex, enum). TypeScript only checks the base type (`number`, `string`), not Zod refinements. Open the router file and read the `.input()` block before writing the call.
- **Audit logging:** mutations use `withAudit` middleware — do not bypass
- **Public pages:** require 4 additions: proxy.ts PUBLIC_PATHS, [slug]/page.tsx RESERVED, sitemap.ts, footer link in site-footer.tsx
- **All public pages:** use `export const dynamic = "force-dynamic"` and fetch company name with try/catch fallback
- **Settings:** stored in DB as key/value (Setting model), fetched via `db.setting.findUnique`
- **CMS blocks:** JSON array of { type, content, level, src, alt, ctaText, ctaHref } objects
- **BlockRenderer:** uses bone/conviction color palette (not zinc) — headings text-bone, paragraphs text-bone/80, dividers border-bone/10, CTA bg-slate-brand/20 with conviction gold button
- **Email:** Nodemailer singleton transport, configured via Settings table
- **Auth:** NextAuth credentials provider, bcrypt hashed passwords, JWT sessions
- **Stripe:** Payment Links per invoice, webhook at /api/webhooks/stripe
- **Timezone:** scheduling stores availability in local timezone, converts to UTC for slot calculation

### Brand Rules

- Entity name: "Akritos Technology Partners, LLC" (legal), "Akritos" (brand)
- Never position as replacing internal IT teams — co-managed model ("we train your team to own it")
- Voice is always "we" (partnership), never "I" (sole proprietor)
- Never overclaim capabilities not done in production
- Kandji is now Iru — use current branding
- Apple Business Manager is now Apple Business (as of April 2026) — consolidated with Apple Business Essentials and Apple Business Connect into one free platform. Use "Apple Business" in new copy. Historical project descriptions may note the prior name in parentheses.
- Geographic positioning: "Remote-first · Serving businesses nationwide" — not Connecticut-only. Founded in CT, serving everywhere. Update `areaServed` in JSON-LD to Country: United States.
- Design: midnight (#1C1F2E), conviction (#C8A96E), bone (#E8E4DC), slate-brand (#4A5068), 2px border-radius
- Body text: text-base (16px), opacity /60 on public pages (not text-sm or /50)
- Copy voice: direct, honest, no filler, no AI tells

### Database

- PostgreSQL 16 in Docker, not exposed to host in production
- 22 Prisma models — see schema.prisma
- Migrations via `prisma db push` (no migration files, push-based)
- Seed scripts in prisma/ directory

### Key Field Names (avoid mistakes)

- InvoiceLine: `lineTotal` (not subtotal), `unitPrice`, `quantity`
- InvoiceLineTax: `taxAmount` (not amount)
- TaxRate: `rate` (Decimal, not rateDecimal)
- Invoice: `stripePaymentLink` (not stripePaymentLinkUrl)
- Contact: `role` (not title)
- TimeEntry: `minutes` (Int, not hours — divide by 60 for display)

### Known Issues

- **Testimonials placeholder:** Homepage has "We're new. Testimonials are earned, not invented." — remove once real testimonials exist, or remove entirely (identified as liability in competitive review)
- **Admin password:** seed now generates a random 24-char password on first run, writes to `.first-admin-credentials` (0600). No more hardcoded `changeme123`. Founder rotated production password manually — confirm by reading the file or by attempting login with the old default (should fail)
- **No CSRF on public API routes:** `/api/tickets/reply` and `/api/files/upload` use POST but no CSRF token — relies on SameSite cookies which is sufficient for browser clients but not for API-style access
- **Rate limiting is in-memory:** `server/rate-limit.ts` uses a Map — resets on server restart, doesn't work across multiple instances. Acceptable for single-instance VPS deployment.
- **No email queue retry backoff:** `app/api/cron/process-emails/route.ts` retries failed emails up to 3 times with no delay between attempts — should add exponential backoff if email failures become common
- **Portal token is permanent:** Client portal tokens (cuid) never expire and can't be rotated without DB manual intervention — add rotation mechanism before handling sensitive client data

### Testing & Deployment

- Tests: `npx vitest run` (invoice tax + utils, must pass before commit)
- Type check: `npx tsc --noEmit` (must pass before commit)
- Deploy: SSH to VPS, `cd /opt/simplerms && git pull && bash deploy.sh`
- Docker: app + db + migrator + mailpit services
- Blog posts seed automatically via `deploy.sh` — it loops over `prisma/seed-blog-*.ts` after every deploy. All blog seeds use upsert with pinned `publishedAt` dates, so this is idempotent — no drift, picks up new posts and edits without manual steps
- **Blog seed dates:** pin `publishedAt` in both `update` and `create` blocks to a hardcoded ISO string. Never use `new Date()` — it resets the date to "now" on every deploy
- Manual seed (dev or one-off): `docker compose --profile tools run --rm migrator npx tsx prisma/seed-blog-{name}.ts`
- If seed script was added after last Docker build: `docker compose --profile tools build migrator` first
- The `--profile` flag goes BEFORE the subcommand: `docker compose --profile tools run` (not `docker compose run --profile tools`)
- **Migrator is behind `profiles: [tools]`** — `docker compose build` alone does NOT rebuild it. `deploy.sh` uses `$COMPOSE --profile tools build --no-cache` to ensure the migrator image stays in sync with prisma/ changes. Without `--profile tools`, new seed files silently 404 inside the container because they're not in the stale image
