# Support Tickets

## Current State

### Working
- `tickets.submit` (public, rate-limited 5/IP/15min) — creates ticket with first message, atomic number generation
- `tickets.byPublicToken` (public) — client-facing ticket tracking, filters internal messages
- `tickets.list` (protected) — paginated, filter by status/priority/assignedTo/clientId
- `tickets.byId` (protected) — full ticket with all messages, files, assignee
- `tickets.assign` (staff) — assigns to staff, auto-sets IN_PROGRESS
- `tickets.updateStatus` (staff) — updates status and optional priority, sets resolvedAt
- `tickets.reply` (staff) — creates message, supports internal notes, auto-moves WAITING_ON_CLIENT back to IN_PROGRESS
- Dashboard list page with status filter buttons and clickable rows
- Dashboard detail page with reply form, status/priority/assignee controls, message thread

### Missing
- Email notification to submitter on ticket creation (confirmation)
- Email notification to submitter on staff reply (non-internal)
- Email notification to assigned staff on new reply from client
- Client reply via email (inbound email parsing)
- Client reply via public token page
- File attachments on messages

## Files

- **Router:** `server/trpc/routers/tickets.ts`
- **List page:** `app/(dashboard)/dashboard/tickets/page.tsx`
- **Detail page:** `app/(dashboard)/dashboard/tickets/[id]/page.tsx`
- **List component:** `components/tickets/ticket-list.tsx`
- **Detail component:** `components/tickets/ticket-detail.tsx`
- **Public tracking:** Uses `byPublicToken` query

## Schema

```prisma
model Ticket {
  id             String        @id @default(cuid())
  ticketNumber   String        @unique  // TKT-00001
  clientId       String?
  assignedToId   String?
  submitterName  String
  submitterEmail String
  subject        String
  status         TicketStatus  @default(OPEN)
  priority       Priority      @default(MEDIUM)
  publicToken    String        @unique @default(cuid())
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  resolvedAt     DateTime?
}

model TicketMessage {
  id        String   @id @default(cuid())
  ticketId  String
  senderId  String?  // null = external submitter
  senderName String?
  body       String   @db.Text
  isInternal Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

## What Needs to Be Built

### 1. Ticket Confirmation Email
In `tickets.submit` mutation, after creating ticket:
- Queue email to submitterEmail
- Include: ticket number, subject, link to track (publicToken URL)
- Template: ticket-confirmed

### 2. Reply Notification Email
In `tickets.reply` mutation, when `isInternal: false`:
- Queue email to ticket's submitterEmail
- Include: ticket number, reply body, link to track
- Template: ticket-reply

### 3. Client Reply via Public Page
Extend `byPublicToken` page:
- Add reply form (name + body) below messages
- Create `tickets.publicReply` mutation (public, rate-limited)
- Notify assigned staff via email

### 4. File Attachments
- Upload files when replying
- Store via File model (ticketMessageId relation)
- Display file links in message thread
