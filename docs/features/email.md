# Email System

## Current State

### Working
- SMTP transport via Nodemailer (singleton, configurable)
- Invoice send email (HTML + text template)
- Settings for SMTP config (smtp_host, smtp_port, smtp_user, email_from)

### Missing
- Ticket reply notification to submitter
- Appointment confirmation on booking
- Appointment cancellation notification
- Appointment reminder (24h before)
- Password reset email
- EmailQueue processor (table exists, nothing reads it)
- Email template management UI

## Files

- **Transport:** `server/email/index.ts` (Nodemailer singleton)
- **Templates:** `server/email/templates/` (invoice template)
- **Settings keys:** smtp_host, smtp_port, smtp_user, smtp_pass (isSecret), email_from
- **Queue model:** EmailQueue in schema.prisma

## Schema

```prisma
model EmailQueue {
  id           String      @id @default(cuid())
  to           String
  subject      String
  templateKey  String
  templateData Json
  status       EmailStatus @default(PENDING)
  attempts     Int         @default(0)
  lastError    String?
  scheduledAt  DateTime    @default(now())
  sentAt       DateTime?
  createdAt    DateTime    @default(now())
}

enum EmailStatus {
  PENDING, SENT, FAILED
}
```

## What Needs to Be Built

### 1. Ticket Reply Notification
When staff replies to a ticket (non-internal message):
- Send email to ticket.submitterEmail
- Subject: "Re: [TKT-#####] {subject}"
- Body: staff reply text + link to track via publicToken
- Template: `ticket-reply`

### 2. Appointment Confirmation
When public booking created:
- Send to bookerEmail
- Subject: "Appointment confirmed — {serviceName} on {date}"
- Body: date, time, duration, cancel link (cancelToken)
- Template: `appointment-confirmed`

### 3. Appointment Cancellation
When appointment cancelled:
- Send to bookerEmail
- Subject: "Appointment cancelled — {serviceName}"
- Body: confirmation of cancellation, link to rebook
- Template: `appointment-cancelled`

### 4. Password Reset
When user requests password reset:
- Send to user email
- Subject: "Reset your password"
- Body: reset link with token, expires in 1 hour
- Template: `password-reset`

### 5. EmailQueue Processor
Simple approach (no Redis/Bull):
- API route `/api/cron/process-emails` that:
  - Queries PENDING emails where scheduledAt <= now
  - Sends each via SMTP transport
  - Updates status to SENT or FAILED (increment attempts)
  - Max 3 attempts
- Called via external cron (systemd timer or cron job hitting the endpoint)
- Alternative: process inline (send immediately, queue as fallback)

### Implementation Pattern
For immediate sends (ticket reply, appointment confirm), send inline in the tRPC mutation and skip the queue. Queue is for scheduled sends (reminders) and retry logic.

```typescript
// Inline send pattern (in mutation)
await sendEmail({
  to: ticket.submitterEmail,
  subject: `Re: [${ticket.ticketNumber}] ${ticket.subject}`,
  template: "ticket-reply",
  data: { body: input.body, trackUrl: `${baseUrl}/tickets/track/${ticket.publicToken}` },
});
```

## SMTP Configuration

Currently in .env / Settings table. For production:
- Google Workspace SMTP relay (once business email is set up)
- Or transactional service (Resend, Postmark) for deliverability
- From address: support@akritos.com or noreply@akritos.com
