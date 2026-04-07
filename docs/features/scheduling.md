# Scheduling & Booking

## Current State

### Working
- `scheduling.listServices` (public) — active services
- `scheduling.serviceBySlug` (public) — service with availability
- `scheduling.createService` (admin) — new bookable service
- `scheduling.setAvailability` (staff) — per service, per day, with timezone
- `scheduling.availableSlots` (public) — calculates free slots considering duration, existing appointments, calendar blocks
- `scheduling.book` (public, rate-limited 10/hr) — creates appointment with conflict detection
- `scheduling.cancel` (public) — cancel via token
- `scheduling.listAppointments` (protected) — filter by date/staff/status
- Public booking page at /book

### Missing
- Confirmation email on booking
- Cancellation email
- Reminder email (24h before)
- Reschedule (cancel + rebook)
- Staff calendar view
- Calendar block management UI
- Google Calendar sync

## Files

- **Router:** `server/trpc/routers/scheduling.ts`
- **Public page:** `app/book/page.tsx`
- **Dashboard page:** `app/(dashboard)/dashboard/scheduling/page.tsx`

## Schema

```prisma
model Service {
  id          String  @id @default(cuid())
  name        String
  description String?
  slug        String  @unique
  duration    Int     // minutes
  bufferAfter Int     @default(0)
  price       Decimal @default(0)
  isPublic    Boolean @default(true)
  isActive    Boolean @default(true)
}

model Appointment {
  id              String            @id @default(cuid())
  serviceId       String
  staffId         String?
  clientId        String?
  bookerName      String
  bookerEmail     String
  bookerPhone     String?
  notes           String?
  status          AppointmentStatus @default(PENDING)
  startsAt        DateTime
  endsAt          DateTime
  timezone        String
  publicToken     String            @unique @default(cuid())
  cancelToken     String            @unique @default(cuid())
  reminderSentAt  DateTime?
}

model StaffAvailability {
  id        String @id @default(cuid())
  userId    String
  serviceId String
  dayOfWeek Int    // 0=Sunday
  startTime String // "09:00"
  endTime   String // "17:00"
  timezone  String
}

model CalendarBlock {
  id       String   @id @default(cuid())
  userId   String
  startsAt DateTime
  endsAt   DateTime
  reason   String?
}
```

## What Needs to Be Built

### 1. Booking Confirmation Email
In `scheduling.book` mutation, after creating appointment:
- Send email to bookerEmail
- Include: service name, date/time, duration, cancel link
- Template: appointment-confirmed

### 2. Cancellation Email
In `scheduling.cancel` mutation:
- Send email to bookerEmail
- Include: confirmation, link to rebook
- Template: appointment-cancelled

### 3. Reminder System
- API route `/api/cron/appointment-reminders`
- Query: appointments where startsAt is 24h from now AND reminderSentAt is null
- Send reminder email
- Set reminderSentAt
- Called via external cron every 15 minutes

### 4. Calendar Block UI
In scheduling dashboard:
- Add "Block time" button
- Date range picker + reason field
- List existing blocks with delete

## Timezone Handling

The availability system stores times in the staff member's local timezone and converts to UTC for slot calculation. This is the most complex part of the scheduling system. The conversion logic is in the router and handles DST correctly.

Key: all appointments store startsAt/endsAt in UTC. Display converts to the viewer's timezone.
