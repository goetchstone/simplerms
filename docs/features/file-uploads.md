# File Uploads

## Current State

### Working
- File model exists with relationships to Client, Invoice, Ticket, TicketMessage, Order
- Upload volume mounted in Docker (uploads_data:/app/uploads)
- User attribution via uploadedById

### Missing
- No tRPC procedures for upload/download
- No API route for file serving
- No upload UI anywhere
- server/storage/ directory is empty (no storage backend)
- No file size limits enforced
- No mime type validation

## Files

- **Storage backend:** `server/storage/` (empty)
- **Schema model:** File in prisma/schema.prisma
- **Docker volume:** uploads_data mapped to /app/uploads (in docker-compose.prod.yml)

## Schema

```prisma
model File {
  id              String  @id @default(cuid())
  filename        String
  originalName    String
  mimeType        String
  sizeBytes       Int
  storagePath     String
  clientId        String?
  invoiceId       String?
  ticketId        String?
  ticketMessageId String?
  orderId         String?
  uploadedById    String?
  createdAt       DateTime @default(now())
}
```

## What Needs to Be Built

### 1. Storage Backend
Create `server/storage/local.ts`:
- `saveFile(buffer, originalName, mimeType)` → returns { filename, storagePath, sizeBytes }
- `getFile(storagePath)` → returns ReadableStream
- `deleteFile(storagePath)` → void
- Files stored at /app/uploads/{yyyy-mm}/{cuid}-{originalName}
- Directory auto-creation

### 2. Upload API Route
`app/api/files/upload/route.ts`:
- POST multipart/form-data
- Auth required (staff or admin)
- Max file size: 10MB
- Allowed types: pdf, png, jpg, jpeg, gif, csv, xlsx, docx, txt
- Returns File record (id, filename, originalName, mimeType, sizeBytes)
- Query params: clientId, invoiceId, ticketId, orderId (optional associations)

### 3. Download API Route
`app/api/files/[id]/route.ts`:
- GET with auth check
- Stream file from storage
- Set Content-Type and Content-Disposition headers
- 404 if file doesn't exist on disk

### 4. tRPC Procedures
Add to a new `files` router:
- `files.list` (protected) — filter by clientId, invoiceId, ticketId
- `files.delete` (staff) — remove record + file from disk

### 5. Upload UI Components
Reusable `<FileUpload>` component:
- Drag-and-drop or click to browse
- Progress indicator
- Show attached files with download/delete
- Used in: ticket detail, invoice detail, client detail

## Implementation Notes

- Start with local storage only (Docker volume)
- S3 backend can be added later by swapping the storage module
- No virus scanning initially — validate mime type only
- Files are not public — all access requires auth
- Consider cleanup job for orphaned files (uploaded but never associated)
