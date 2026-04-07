# Background Jobs

## Current State

- EmailQueue model exists (PENDING/SENT/FAILED, attempts, scheduledAt)
- Appointment.reminderSentAt field exists
- No job processor, no cron, no queue consumer

## Approach

Keep it simple. No Redis, no Bull, no worker processes. Use API routes called by system cron.

## What Needs to Be Built

### 1. Email Queue Processor
`app/api/cron/process-emails/route.ts`:
- GET request (called by cron)
- Auth: check for CRON_SECRET header (shared secret in .env)
- Query: PENDING emails where scheduledAt <= now, limit 20
- For each: attempt send via SMTP
  - Success: status = SENT, set sentAt
  - Failure: increment attempts, set lastError
  - If attempts >= 3: status = FAILED
- Return: { processed, sent, failed }

### 2. Appointment Reminders
`app/api/cron/appointment-reminders/route.ts`:
- GET request (called by cron)
- Auth: CRON_SECRET header
- Query: CONFIRMED appointments where startsAt between now and now+25h AND reminderSentAt is null
- For each: send reminder email, set reminderSentAt
- Return: { sent }

### 3. Overdue Invoice Flagging
`app/api/cron/invoice-overdue/route.ts`:
- GET request (called by cron)
- Auth: CRON_SECRET header
- Query: invoices with status SENT/VIEWED/PARTIAL where dueDate < now
- Update status to OVERDUE
- Optional: send overdue notification email
- Return: { flagged }

### 4. System Cron Setup
Add to deploy.sh or Docker entrypoint:
```cron
*/5 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/process-emails
*/15 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/appointment-reminders
0 6 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/invoice-overdue
```

### 5. Cron Secret
Add CRON_SECRET to .env and deploy.sh secret generation.
Validate in each cron route: if header doesn't match, return 401.

## Why Not Bull/Redis

- Single server deployment
- Low volume (< 100 emails/day for years)
- Cron + HTTP is debuggable, testable, zero dependencies
- Can always add Redis later if needed
