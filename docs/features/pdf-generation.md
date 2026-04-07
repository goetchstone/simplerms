# PDF Invoice Generation

## Current State

- `server/pdf/invoice.tsx` exists with React-based PDF template
- Invoice model has `pdfPath` field
- Docker volume mounted for file storage
- No tRPC mutation to trigger generation
- No download route

## Files

- **Template:** `server/pdf/invoice.tsx`
- **Invoice router:** `server/trpc/routers/invoices.ts`

## What Needs to Be Built

### 1. PDF Generation Mutation
Add `invoices.generatePdf` (staff):
- Fetch invoice with lines, taxes, client
- Render PDF using existing template
- Save to /app/uploads/invoices/{invoiceNumber}.pdf
- Update invoice.pdfPath
- Return file path

### 2. PDF Download Route
`app/api/invoices/[id]/pdf/route.ts`:
- Auth required (staff)
- Stream PDF from disk
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="{invoiceNumber}.pdf"

### 3. Public PDF Access
Via publicToken (for client-facing invoice view):
- `app/api/invoices/pdf/[token]/route.ts`
- No auth required (token is secret)
- Same streaming approach

### 4. Auto-generate on Send
In `invoices.send` mutation:
- Generate PDF if not already generated
- Attach PDF to email

### 5. UI Integration
- "Download PDF" button on invoice detail page
- Auto-generate when clicking download if pdfPath is null
- Show PDF status (generated/not generated)

## Dependencies
- Check what PDF library is installed (likely @react-pdf/renderer or similar)
- May need to add a dependency if template uses one not yet installed
