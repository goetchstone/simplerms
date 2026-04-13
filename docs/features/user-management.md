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
- `users.requestPasswordReset` (public) — rate-limited, anti-enumeration, generates token, sends email
- `users.resetPassword` (public) — validates token, sets new password, deletes token
- Forgot password page at `/forgot-password` with email form
- Reset password page at `/reset-password` with token from URL, new password + confirm
- "Forgot password?" link on login form

### Missing
- Delete user (only deactivation exists)

## Files

- **Router:** `server/trpc/routers/users.ts`
- **Dashboard page:** `app/(dashboard)/dashboard/settings/users/page.tsx`
- **UI component:** `components/settings/users-table.tsx`
- **Account page:** `app/(dashboard)/dashboard/account/page.tsx`
- **Auth pages:** `app/(auth)/login/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/reset-password/page.tsx`
- **Auth components:** `components/auth/login-form.tsx`, `components/auth/forgot-password-form.tsx`, `components/auth/reset-password-form.tsx`
- **Email template:** `server/email/templates/password-reset.ts`
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

VerificationToken model stores password reset tokens (identifier=email, 1-hour expiry).

## Dependencies
- Email sending (SMTP must be configured)
- VerificationToken model (exists)
