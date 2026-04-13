// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { saveFile } from "@/server/storage/local";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { filename, storagePath, sizeBytes } = await saveFile(buffer, file.name, file.type);

  // Optional entity associations from query params.
  const clientId = request.nextUrl.searchParams.get("clientId");
  const invoiceId = request.nextUrl.searchParams.get("invoiceId");
  const ticketId = request.nextUrl.searchParams.get("ticketId");
  const ticketMessageId = request.nextUrl.searchParams.get("ticketMessageId");
  const orderId = request.nextUrl.searchParams.get("orderId");

  const record = await db.file.create({
    data: {
      filename,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes,
      storagePath,
      uploadedById: session.user.id,
      ...(clientId && { clientId }),
      ...(invoiceId && { invoiceId }),
      ...(ticketId && { ticketId }),
      ...(ticketMessageId && { ticketMessageId }),
      ...(orderId && { orderId }),
    },
  });

  return NextResponse.json({
    id: record.id,
    filename: record.filename,
    originalName: record.originalName,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
  });
}
