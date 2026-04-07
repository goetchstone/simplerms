# Settings Management

## Current State

### Working
- `settings.upsert` (admin) — update any whitelisted setting
- Settings stored in DB as key/value pairs (Setting model)
- Whitelist: company_name, company_email, company_phone, company_address, invoice_prefix, default_currency, default_due_days, smtp_host, smtp_port, smtp_user, email_from
- Secret settings (smtp_pass) stored with isSecret flag
- Settings page exists at `/dashboard/settings` (hub with links)

### Missing
- No UI form for editing company details
- No UI for SMTP configuration
- No UI for invoice defaults
- Settings only changeable via API calls or database
- SMTP password not settable via settings.upsert (not in whitelist)
- No setting for Stripe keys (env-only)
- Dynamic SMTP reload (transport created at startup, not refreshed)

## Files

- **Router:** `server/trpc/routers/settings.ts`
- **Dashboard hub:** `app/(dashboard)/dashboard/settings/page.tsx`
- **Sub-pages:** cms/, users/, tax-rates/ (all working)
- **Email transport:** `server/email/index.ts` (reads settings at init)

## Schema

```prisma
model Setting {
  id       String  @id @default(cuid())
  key      String  @unique
  value    String
  isSecret Boolean @default(false)
}
```

## What Needs to Be Built

### 1. Company Settings Page
New page at `/dashboard/settings/company`:
- Company name (text)
- Company email (text)
- Company phone (text)
- Company address (textarea or structured fields)
- Save button → calls settings.upsert for each

### 2. Email/SMTP Settings Page
New page at `/dashboard/settings/email`:
- SMTP host (text)
- SMTP port (number)
- SMTP user (text)
- SMTP password (password field — add to whitelist with isSecret)
- From address (text)
- "Send test email" button
- Note: transport needs to be recreated after settings change

### 3. Invoice Settings Page
New page at `/dashboard/settings/invoices`:
- Invoice number prefix (text, e.g., "INV-")
- Default currency (dropdown: USD)
- Default payment terms / due days (number)

### 4. Settings Read Endpoint
Add `settings.list` (admin) — return all non-secret settings as key/value map.
Add `settings.get` (admin) — return single setting by key.

Currently settings are only read internally by server code (e.g., getCompanyName).
The UI needs a way to fetch current values to populate forms.

### 5. Add smtp_pass to Whitelist
Currently missing from the settings whitelist. Add it with isSecret: true handling.

## Implementation Notes

- Settings hub at `/dashboard/settings` already links to sub-pages (cms, users, tax-rates)
- Add links to new pages: company, email, invoices
- Follow existing pattern: each sub-page is its own directory with page.tsx
- All settings mutations are admin-only
- Audit log captures setting changes automatically via withAudit middleware
