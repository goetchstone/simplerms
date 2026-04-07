# Architecture

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **API:** tRPC v11 with Zod validation
- **Database:** PostgreSQL 16 via Prisma ORM
- **Auth:** NextAuth.js (credentials provider, JWT sessions)
- **Payments:** Stripe (Payment Links + webhooks)
- **Email:** Nodemailer (SMTP, configurable)
- **Styling:** Tailwind CSS v4
- **Deployment:** Docker Compose on VPS, Nginx reverse proxy

## Directory Structure

```
app/
  (auth)/login/          # Login page
  (dashboard)/dashboard/ # Staff dashboard (19 pages)
  (portal)/portal/       # Client portal (skeleton)
  (site)/                # Not used (public pages at root)
  api/                   # REST: health, stripe webhook, trpc, auth
  blog/                  # Blog listing + [slug] pages
  [slug]/                # CMS dynamic pages
  about|book|contact|... # Static public pages

components/
  auth/                  # LoginForm
  brand/                 # LogoMark
  cms/                   # BlockRenderer, CmsManager
  settings/              # UsersTable, TaxRateManager
  site/                  # SiteNav, SiteFooter, JsonLd
  ui/                    # Shared UI primitives

server/
  auth/                  # NextAuth config
  db/                    # Prisma client singleton
  email/                 # Nodemailer transport + templates
  invoice/               # Tax calculation engine
  pdf/                   # Invoice PDF template (unused)
  storage/               # File storage (empty)
  trpc/                  # Router tree + middleware

prisma/
  schema.prisma          # 22 models
  seed.ts                # Initial data (admin user, settings, service)
  seed-blog-*.ts         # Blog post seed scripts
```

## tRPC Procedure Hierarchy

```
publicProcedure          # No auth required
  └─ protectedProcedure  # Must be logged in
       └─ staffProcedure # Must be STAFF or ADMIN
            └─ adminProcedure # Must be ADMIN
```

Audit logging applied via `withAudit` middleware on mutations.

## Auth Flow

1. User submits email + password at /login
2. NextAuth credentials provider validates against User.passwordHash (bcrypt)
3. Checks user.isActive
4. Returns JWT with user id, role, email
5. tRPC reads session via `auth()` helper
6. Procedure guards enforce role requirements

## Database

22 Prisma models. Key relationships:

- Client → Contacts, Notes, Invoices, Tickets, Orders, Appointments, TimeEntries, Files
- Invoice → InvoiceLines → InvoiceLineTaxes, Payments
- Ticket → TicketMessages
- CatalogItem → InventoryItem → StockMovements
- Service → Appointments, StaffAvailability
- User → Appointments, TimeEntries, AuditLogs, CalendarBlocks

## Proxy (Middleware)

`proxy.ts` controls auth bypass. PUBLIC_PATHS array defines routes that don't require login. Everything else redirects to /login.

## Public Pages

All public pages use `export const dynamic = "force-dynamic"` and fetch company name from DB with try/catch fallback to "Akritos".

New public routes require three additions:
1. Path in PUBLIC_PATHS array (proxy.ts)
2. Slug in RESERVED set (app/[slug]/page.tsx)
3. Entry in sitemap (app/sitemap.ts)

## Brand Design System

- **midnight:** #1C1F2E (backgrounds)
- **conviction:** #C8A96E (gold accents, CTAs)
- **bone:** #E8E4DC (text on dark)
- **slate-brand:** #4A5068 (secondary backgrounds)
- **parchment:** #F5F4F0 (light backgrounds)
- Border radius: 2px everywhere (sharp, intentional)
- Icons: Lucide React, strokeWidth 1.5
