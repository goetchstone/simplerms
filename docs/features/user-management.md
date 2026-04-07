# User Management

## Current State

### Working
- `users.list` (admin) — lists all users
- `users.create` (admin) — new user with email, name, password, role
- `users.updateRole` (admin) — change ADMIN/STAFF/READONLY, guards last admin
- `users.setActive` (admin) — enable/disable user
- `users.changePassword` (protected) — user changes own password (requires current)

### Missing
- Edit user name (admin or self)
- Edit user email (admin or self)
- Delete user (only deactivation exists)
- Password reset flow (forgot password → email → new password)
- Profile page beyond password change

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

### 1. Update Profile (name/email)
Add `users.updateProfile` mutation:
- Protected: user can edit own name/email
- Admin: can edit any user's name/email
- Email change requires uniqueness check
- Audit log the change (before/after)
- Update the session after email change (JWT contains email)

### 2. Admin Edit User
Add to UsersTable component:
- Edit button per user row
- Modal with name/email/role fields
- Calls updateProfile + updateRole

### 3. Account Page Enhancement
Current: password change only.
Add:
- Name field (editable, save button)
- Email field (editable, save button)
- Show role (read-only)
- Show created date

### 4. Password Reset Flow
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
