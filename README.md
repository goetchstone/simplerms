# Akritos

Combined marketing site and consulting platform (SimpleRMS) for **Akritos Technology Partners, LLC** — Apple device management and AI risk consulting for small businesses.

**Public site:** https://akritos.com

## Repository scope

- **What's public (this repo):** the application code, technical architecture, decisions log, lessons log, framework practices, deployment guidance
- **What's not public:** strategic growth playbook, pricing experiments, customer artifacts, internal hiring plans

The platform code is open source because the brand is built on transparency. Business strategy is not, because that's competitive.

## Stack

- Next.js 16 (App Router) · PostgreSQL 16 · Prisma 6
- Auth.js v5 · tRPC v11 · Tailwind 4
- Stripe (Payment Links + webhooks) · Nodemailer (SMTP)
- Docker Compose · DreamCompute VPS · Nginx · Let's Encrypt

## Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Operating constraints + project context. Read first. |
| `docs/FRAMEWORK.md` | The disciplines that prevent prompt jockeying. |
| `docs/ARCHITECTURE.md` | Stack, structure, design patterns. |
| `docs/DECISIONS.md` | Append-only architectural decisions with rationale. |
| `docs/LESSONS.md` | Append-only small lessons from sessions. |
| `docs/ROADMAP.md` | Build status (what works, what's queued). |
| `docs/features/*.md` | Per-feature specs. |
| `DREAMHOST.md` | VPS deployment guide. |
| `SECURITY.md` | Vulnerability reporting policy. |

## Development

```bash
npm install
docker compose up -d db mailpit
npx prisma db push
npx prisma db seed
npm run dev
```

Sign in at http://localhost:3000/login. The seed creates an admin account; the password is generated and printed once during the seed run.

## Deploy

```bash
ssh your-vps
cd /opt/simplerms && git pull && bash deploy.sh
```

The deploy script handles: build, schema push, idempotent seed, health-check, container swap, nginx config, Let's Encrypt cert. Blog post seeds in `prisma/seed-blog-*.ts` are idempotent and run on every deploy.

## Security

See [`SECURITY.md`](./SECURITY.md). CI runs Dependabot, CodeQL, Semgrep, gitleaks, and `npm audit` on every push and PR.

## License

MIT.
