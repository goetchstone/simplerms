# Client Portal

## Current State

- Route structure exists at `app/(portal)/portal/`
- Clients have `portalToken` field for token-based access
- Public invoice view works via publicToken
- Public ticket tracking works via publicToken
- No unified portal experience

## Schema

Client has `portalToken` (unique, auto-generated) for portal access.

## What Needs to Be Built

### 1. Portal Landing Page
`app/(portal)/portal/[token]/page.tsx`:
- Validates portalToken
- Shows client name, company
- Links to: invoices, tickets, appointments
- No login required (token is the auth)

### 2. Portal Invoice List
`app/(portal)/portal/[token]/invoices/page.tsx`:
- List client's invoices (non-DRAFT, non-VOID)
- Status, amount, due date, payment status
- Link to existing public invoice view
- Pay button for unpaid invoices

### 3. Portal Ticket List
`app/(portal)/portal/[token]/tickets/page.tsx`:
- List client's tickets
- Status, priority, last updated
- Link to existing public ticket tracking view
- "New ticket" button → pre-fills client info

### 4. Portal Appointments
`app/(portal)/portal/[token]/appointments/page.tsx`:
- List upcoming and past appointments
- Status, date, service
- "Book new" link → /book with client pre-fill
- Cancel link for upcoming appointments

### 5. tRPC Procedures
Add portal-specific queries (public, token-validated):
- `portal.validate` — check token, return client name
- `portal.invoices` — client's invoices
- `portal.tickets` — client's tickets
- `portal.appointments` — client's appointments

### 6. Portal Link Delivery
- Include portal link in invoice emails
- Include in ticket confirmation
- Portal URL: /portal/{portalToken}

## Security
- portalToken is a cuid — not guessable
- No sensitive data editable via portal (read-only + actions like pay/cancel)
- Rate limit portal access to prevent token enumeration
- Consider adding portal token rotation
