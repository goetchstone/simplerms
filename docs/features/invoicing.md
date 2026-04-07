# Invoicing

## Current State

### Working
- `invoices.create` (staff) — multi-line with tax calculation
- `invoices.list` (protected) — filter by client/status, pagination
- `invoices.byId` (protected) — full invoice with lines, taxes, payments
- `invoices.byPublicToken` (public) — client-facing view, marks SENT→VIEWED
- `invoices.generatePaymentLink` (staff) — Stripe Payment Link
- `invoices.send` (staff) — email invoice with payment link
- `invoices.void` (staff) — cancel invoice, deactivate payment link
- Stripe webhook handles checkout.session.completed → records payment

### Missing
- Edit/update DRAFT invoice (must void and recreate)
- Duplicate invoice
- PDF generation (template exists at server/pdf/invoice.tsx, no route)
- Recurring invoices / templates
- Manual payment recording via UI (model supports it, no mutation)
- Partial payment handling improvements
- Credit notes

## Files

- **Router:** `server/trpc/routers/invoices.ts`
- **Tax engine:** `server/invoice/tax.ts`
- **PDF template:** `server/pdf/invoice.tsx`
- **Email template:** `server/email/templates/` (invoice send)
- **Dashboard pages:**
  - `app/(dashboard)/dashboard/invoices/page.tsx` (list)
  - `app/(dashboard)/dashboard/invoices/new/page.tsx` (create)
  - `app/(dashboard)/dashboard/invoices/[id]/page.tsx` (detail)
- **Public view:** `app/(site)/invoice/[token]/page.tsx` or similar
- **Stripe webhook:** `app/api/webhooks/stripe/route.ts`

## Schema

```prisma
model Invoice {
  id                   String        @id @default(cuid())
  invoiceNumber        String        @unique
  clientId             String
  createdById          String
  status               InvoiceStatus @default(DRAFT)
  issueDate            DateTime      @default(now())
  dueDate              DateTime
  currency             String        @default("USD")
  subtotal             Decimal       @default(0)
  taxTotal             Decimal       @default(0)
  total                Decimal       @default(0)
  paidAmount           Decimal       @default(0)
  publicToken          String        @unique @default(cuid())
  stripePaymentLink    String?
  stripePaymentLinkId  String?
  pdfPath              String?
  sentAt               DateTime?
  paidAt               DateTime?
  version              Int           @default(1)
  // ... relationships: lines, payments, files
}

enum InvoiceStatus {
  DRAFT, SENT, VIEWED, PARTIAL, PAID, OVERDUE, VOID
}
```

## What Needs to Be Built

### 1. Update DRAFT Invoice
Add `invoices.update` mutation:
- Staff only, DRAFT status only
- Update: client, issueDate, dueDate, currency, notes
- Replace lines: delete existing, insert new (simpler than diffing)
- Recalculate subtotal, taxTotal, total
- Increment version
- Audit log with before/after

### 2. Duplicate Invoice
Add `invoices.duplicate` mutation:
- Staff only
- Copy all lines from source invoice
- New invoice number, DRAFT status
- New publicToken
- Clear sentAt, paidAt, stripePaymentLink
- Set issueDate to now, dueDate to now + default_due_days

### 3. Record Manual Payment
Add `invoices.recordPayment` mutation:
- Staff only
- Amount, method (CASH/CHECK/BANK_TRANSFER/OTHER), reference, paidAt
- Update invoice paidAmount
- If paidAmount >= total → status = PAID, set paidAt
- If paidAmount > 0 but < total → status = PARTIAL

### 4. PDF Generation
- Wire up server/pdf/invoice.tsx
- Add `invoices.generatePdf` mutation
- Store at uploads/invoices/{id}.pdf
- Set pdfPath on invoice
- Attach to email when sending

## Tax Calculation

Tax engine lives at `server/invoice/tax.ts`. Supports:
- Multiple tax rates per line
- Compound taxes (tax on tax)
- Per-line tax breakdown stored in InvoiceLineTax

Tests at `__tests__/invoice-tax.test.ts` — 5 tests, all passing.

## Stripe Integration

- Payment Links created per invoice (not Checkout Sessions directly)
- Webhook at `/api/webhooks/stripe` handles `checkout.session.completed`
- Links invoice via metadata.invoiceId
- Idempotent via stripe session ID check
- Missing: charge.refunded, payment_intent.payment_failed handlers
