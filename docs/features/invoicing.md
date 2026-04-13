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
- `invoices.update` (staff) — edit DRAFT invoices (replace lines, recalculate)
- `invoices.duplicate` (staff) — copy invoice as new DRAFT with new number
- Edit page at `/dashboard/invoices/[id]/edit` (DRAFT only)
- Edit and Duplicate buttons on invoice detail page
- Stripe webhook handles checkout.session.completed → records payment
- `invoices.recordPayment` (staff) — manual payment recording with method, reference, auto-status transition (PARTIAL/PAID)
- Record payment dialog on invoice detail page with remaining balance display
- PDF invoice generation via API route `/api/invoices/[id]/pdf` using react-pdf template
- Download PDF button on invoice detail page

### Missing
- Recurring invoices / templates
- Credit notes
- PDF attachment on email send

## Files

- **Router:** `server/trpc/routers/invoices.ts`
- **Tax engine:** `server/invoice/tax.ts`
- **PDF template:** `server/pdf/invoice.tsx`
- **Email template:** `server/email/templates/` (invoice send)
- **Dashboard pages:**
  - `app/(dashboard)/dashboard/invoices/page.tsx` (list)
  - `app/(dashboard)/dashboard/invoices/new/page.tsx` (create)
  - `app/(dashboard)/dashboard/invoices/[id]/page.tsx` (detail)
  - `app/(dashboard)/dashboard/invoices/[id]/edit/page.tsx` (edit DRAFT)
- **PDF route:** `app/api/invoices/[id]/pdf/route.ts`
- **PDF template:** `server/pdf/invoice.tsx`
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
