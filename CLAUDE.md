# CLAUDE.md

## Core Philosophy

KISS. Simplicity and elegance above all else.

Do it right. No shortcuts, no hacks, no "we'll fix it later." Every commit is production-ready and deployable.

## Code Quality

- Every file starts with its path as a comment on line 1
- Comments explain *why*, never *what* — no restating the obvious
- No AI tells — no boilerplate filler, no "this function does X" noise
- Small functions, single responsibility, clear naming
- No dead code, no commented-out code, no TODOs left behind
- Consistent formatting — follow existing patterns exactly

## Engineering Standards

- Never break the build — run tests before committing
- Handle errors explicitly — no silent failures, no swallowed exceptions
- Validate at system boundaries, trust internals
- No premature abstraction — earn complexity through repetition
- Minimal dependencies — every dependency is a liability
- Security by default — no hardcoded secrets, no injection vectors, sanitize inputs
- Idempotent operations where possible
- Logging that tells you what happened, not that something happened
- Name things precisely — if you can't name it clearly, you don't understand it

## Process

- Small, focused commits with clear messages
- Read before you write — understand existing code before changing it
- Delete more code than you add when possible
- If a fix is ugly, the design is wrong — fix the design
- Measure before optimizing — no speculative performance work

## Project: SimpleRMS / Akritos

This is a combined RMS (Resource Management System) backend + marketing site for Akritos Technology Partners, LLC — an Apple/MDM IT consultancy based in Connecticut.

### Architecture

- See `docs/ARCHITECTURE.md` for full stack details, directory structure, and design system
- See `docs/ROADMAP.md` for build priorities and current status
- Feature specs live in `docs/features/` — read the relevant doc before building

### Key Patterns

- **tRPC hierarchy:** publicProcedure → protectedProcedure → staffProcedure → adminProcedure
- **Audit logging:** mutations use `withAudit` middleware — do not bypass
- **Public pages:** require 3 additions: proxy.ts PUBLIC_PATHS, [slug]/page.tsx RESERVED, sitemap.ts
- **All public pages:** use `export const dynamic = "force-dynamic"` and fetch company name with try/catch fallback
- **Settings:** stored in DB as key/value (Setting model), fetched via `db.setting.findUnique`
- **CMS blocks:** JSON array of { type, content, level, src, alt, ctaText, ctaHref } objects
- **Email:** Nodemailer singleton transport, configured via Settings table
- **Auth:** NextAuth credentials provider, bcrypt hashed passwords, JWT sessions
- **Stripe:** Payment Links per invoice, webhook at /api/webhooks/stripe
- **Timezone:** scheduling stores availability in local timezone, converts to UTC for slot calculation

### Brand Rules

- Entity name: "Akritos Technology Partners, LLC" (legal), "Akritos" (brand)
- Never position as replacing internal IT teams — co-managed model
- Never overclaim capabilities not done in production
- Kandji is now Iru — use current branding
- Design: midnight (#1C1F2E), conviction (#C8A96E), bone (#E8E4DC), 2px border-radius
- Copy voice: direct, honest, no filler, no AI tells

### Database

- PostgreSQL 16 in Docker, not exposed to host in production
- 22 Prisma models — see schema.prisma
- Migrations via `prisma db push` (no migration files, push-based)
- Seed scripts in prisma/ directory

### Testing & Deployment

- Tests: `npx vitest run` (invoice tax + utils, must pass before commit)
- Type check: `npx tsc --noEmit` (must pass before commit)
- Deploy: SSH to VPS, `cd /opt/simplerms && git pull && bash deploy.sh`
- Docker: app + db + migrator + mailpit services
- Blog posts seeded via `docker compose --profile tools run --rm migrator npx tsx prisma/seed-blog-{name}.ts`
