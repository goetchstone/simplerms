# User Management

## Current State

### Working
- `users.list` (admin) — lists all users
- `users.create` (admin) — new user with email, name, password, role
- `users.updateRole` (admin) — change ADMIN/STAFF/READONLY, guards last admin
- `users.setActive` (admin) — enable/disable user
- `users.changePassword` (protected) — user changes own password (requires current)
- `users.updateProfile` (protected) — user edits own name/email with uniqueness check
- `users.update` (admin) — admin edits any user's name/email
- Account page with profile edit form + password change
- Admin users table with edit dialog (name/email), role dropdown, activate/deactivate

### Missing
- Delete user (only deactivation exists)
- Password reset flow (forgot password → email → new password)

## Files

- **Router:** `server/trpc/routers/users.ts`
- **Dashboard page:** `app/(dashboard)/dashboard/settings/users/page.tsx`
- **UI component:** `components/settings/users-table.tsx`
- **Account page:** `app/(dashboard)/dashboard/account/page.tsx`
- **Auth config:** `server/auth/index.ts`

## Schema

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String?
  passwordHash String?
  role         UserRole  @default(STAFF)
  isActive     Boolean   @default(true)
  // ... relationships
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

VerificationToken model exists but is unused — built for password reset.

## What Needs to Be Built

### 1. Password Reset Flow
- Add `users.requestPasswordReset` (public) — generates token, sends email
- Add `users.resetPassword` (public) — validates token, sets new password
- Add `/reset-password` page with token from URL
- Add "Forgot password?" link on login page
- Uses existing VerificationToken model
- Token expires after 1 hour
- Rate limit: 3 requests per 15 minutes

## Dependencies
- Email sending (SMTP must be configured)
- VerificationToken model (exists)
