# CRM / Client Management

## Current State

### Working
- `crm.listClients` (protected) — paginated search by name/email/company, includes tag/invoice counts
- `crm.clientById` (protected) — full detail with contacts, tags, notes, activity log, entity counts
- `crm.createClient` (staff) — creates client with address JSON, logs activity
- `crm.updateClient` (staff) — updates any client field, logs activity
- `crm.addNote` (staff) — adds internal note, logs activity
- `crm.createContact` (staff) — creates contact, enforces single primary per client
- `crm.updateContact` (staff) — updates contact, handles primary reordering
- `crm.deleteContact` (staff) — deletes contact
- Dashboard list page with search and create modal
- Dashboard detail page with edit dialog, notes, contacts, activity log, stats

### Missing
- Tag management UI (tags exist in schema but no CRUD for tags or client-tag assignment)
- Client deactivation/archival from UI
- Client merge (combine duplicate records)
- Contact add/edit/delete from client detail page UI (backend works, no frontend)
- Address management UI
- Client import (CSV/bulk)
- Portal token management (regenerate/revoke)

## Files

- **Router:** `server/trpc/routers/crm.ts`
- **Validations:** `lib/validations/client.ts`
- **List page:** `app/(dashboard)/dashboard/crm/clients/page.tsx`
- **Detail page:** `app/(dashboard)/dashboard/crm/clients/[id]/page.tsx`
- **List component:** `components/crm/clients-table.tsx`
- **Detail component:** `components/crm/client-detail.tsx`

## Schema

```prisma
model Client {
  id          String    @id @default(cuid())
  name        String
  email       String?
  phone       String?
  company     String?
  address     Json?     // { street, city, state, zip, country }
  notes       String?   @db.Text
  portalToken String    @unique @default(cuid())
  isActive    Boolean   @default(true)
}

model Contact {
  id        String  @id @default(cuid())
  clientId  String
  name      String
  email     String?
  phone     String?
  role      String? // not "title"
  isPrimary Boolean @default(false)
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  color String?
}
```

## What Needs to Be Built

### 1. Contact Management UI
In client detail page:
- Add "New contact" button → modal with name/email/phone/role/isPrimary
- Edit button per contact row → same modal
- Delete button with confirmation
- Uses existing `crm.createContact`, `crm.updateContact`, `crm.deleteContact`

### 2. Tag Management
- Add `crm.listTags` query
- Add `crm.createTag` / `crm.deleteTag` mutations
- Add `crm.tagClient` / `crm.untagClient` mutations
- Tag picker in client detail page
- Tag filter on client list

### 3. Client Archival
- Add archive/deactivate button to client detail
- Filter inactive clients from default list view
- Uses existing `isActive` field — just needs UI toggle
