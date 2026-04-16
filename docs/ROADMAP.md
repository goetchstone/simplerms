# SimpleRMS Roadmap

## Phase 1: Core Backend (Must-Have for First Client)

These are blockers. You cannot invoice a client or manage their account without these.

### 1.1 User Profile Management ✅
- **File:** `docs/features/user-management.md`
- ✅ Admin can edit any user's name and email
- ✅ User can edit their own name and email
- ✅ Password reset flow (forgot password → email → reset)

### 1.2 Invoice Edit/Update ✅
- **File:** `docs/features/invoicing.md`
- ✅ Edit DRAFT invoices (add/remove lines, change amounts)
- ✅ Duplicate invoice (copy existing as new DRAFT)
- ✅ Manual payment recording (PARTIAL/PAID auto-transition)
- ✅ PDF invoice generation via API route

### 1.3 Email Notifications ✅
- **File:** `docs/features/email.md`
- ✅ Ticket confirmation email on submit
- ✅ Ticket reply notification to submitter
- ✅ Appointment confirmation email on booking
- ✅ Appointment cancellation email
- ✅ Password reset email

### 1.35 CRM Contact Management ✅
- **File:** `docs/features/crm.md`
- ✅ Add/edit/delete contacts from client detail page

### 1.4 Settings UI ✅
- **File:** `docs/features/settings.md`
- ✅ Dashboard page to manage company details (name, email, phone, address)
- ✅ SMTP configuration (host, port, user, password, from address)
- ✅ Invoice defaults (prefix, currency, due days)

---

## Phase 2: Operational Polish (First 3 Months)

These make the system usable day-to-day without workarounds.

### 2.1 File Upload/Download ✅
- **File:** `docs/features/file-uploads.md`
- ✅ Local storage backend (server/storage/local.ts)
- ✅ Upload API route (POST /api/files/upload, 10MB, type whitelist)
- ✅ Download API route (GET /api/files/[id], auth required)
- ⬜ Upload UI component (drag-and-drop, progress)

### 2.15 Client Portal ✅
- **File:** `docs/features/client-portal.md`
- ✅ Portal landing page at /portal/[token]
- ✅ Invoice list → links to public invoice view
- ✅ Ticket list → links to public ticket tracking
- ✅ Appointment list with cancel links
- ✅ Portal tRPC router with rate-limited token validation

### 2.2 Appointment Reminders ✅
- **File:** `docs/features/scheduling.md`
- ✅ Email reminder 24h before appointment
- ✅ Cron API route at /api/cron/reminders (CRON_SECRET protected)
- ✅ Uses reminderSentAt field to prevent duplicates

---

## Phase 3: Growth Features (Months 3-6)

These become important as client count grows.

### 3.1 Background Job Processor ✅
- **File:** `docs/features/background-jobs.md`
- ✅ Process EmailQueue table (cron route at /api/cron/process-emails)
- ✅ Appointment reminders (cron route at /api/cron/reminders)
- ✅ Overdue invoice flagging (cron route at /api/cron/overdue)
- Simple cron-based, no Redis/Bull dependency

### 3.2 Invoice Recurring/Templates
- Invoice templates for managed service clients ($50/user/mo)
- Auto-generate monthly invoices from template
- **Why:** Manual invoice creation for recurring clients doesn't scale

### 3.3 Stripe Webhook Expansion ✅
- ✅ Handle charge.refunded (adjusts paidAmount, creates negative payment)
- ✅ Handle payment_intent.payment_failed (audit log entry)

### 3.4 Report Export ✅
- ✅ CSV export for invoices, clients, and time entries (/api/reports/export)
- ✅ Download links on reports dashboard page

### 3.5 Public Ticket Tracking ✅
- ✅ Public tracking page at /support/track?token=...
- ✅ Message thread view (non-internal messages)
- ✅ Client reply form with rate limiting
- ✅ Auto-reopen ticket on client reply (WAITING_ON_CLIENT → OPEN)

### 3.6 File Upload UI ✅
- ✅ Drag-and-drop upload component (components/ui/file-upload.tsx)
- ✅ Integrated into ticket detail sidebar
- ✅ Integrated into invoice detail page
- ✅ Client-side type + size validation

### 3.7 Client API Key Management
- CRUD for client API keys (model exists with AES-256-GCM encryption)
- UI in client detail page
- **Why:** Future integrations, webhook auth

---

## Phase 4: Scale (6+ Months)

### 4.1 OAuth Login (Google)
### 4.2 Role Permission Granularity
### 4.3 Multi-tenant / White-label
### 4.4 Webhook Outgoing Events
### 4.5 Bulk Import (clients, catalog)
### 4.6 Audit Log Retention Policy
### 4.7 S3 Storage Backend

---

## Current Status

| Area | Status | Notes |
|------|--------|-------|
| Auth (login/logout) | Working | Credentials only |
| User CRUD | Working | Full CRUD + profile edit |
| CRM/Clients | Working | Full CRUD + contacts + notes |
| Invoicing | Working | Create, edit, duplicate, send, pay, manual payment, PDF |
| Stripe Payments | Working | Payment links + webhook + refunds + failed payment logging |
| Booking/Scheduling | Working | Public booking, availability |
| Support Tickets | Working | Public submit, staff manage, public tracking + client reply |
| CMS (Pages/Posts) | Working | Block-based content |
| Time Tracking | Working | Full CRUD + reports |
| Catalog/Inventory | Working | CRUD + stock movements |
| Orders | Working | CRUD + link to invoice |
| Reports | Working | Revenue, aging, top clients, CSV export |
| Audit Log | Working | Auto-logged via middleware |
| Email Sending | Working | Invoice, ticket, appointment, password reset |
| File Uploads | Working | Local storage, upload/download routes, drag-and-drop UI |
| PDF Generation | Working | API route, react-pdf template |
| Settings UI | Working | Company, SMTP, invoice defaults |
| Background Jobs | Working | Email queue processor + reminders + overdue flagging |
| Client Portal | Working | Token-based, invoices/tickets/appointments |
| Public Pages | Working | Homepage, about, services, pricing, contact, careers, nonprofits, privacy, terms, blog, book, support |
