// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { getFile } from "@/server/storage/local";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const file = await db.file.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const buffer = await getFile(file.storagePath);
    // Strip quotes/CR/LF from the client-supplied name so it can't break the
    // header, and send nosniff so a browser won't MIME-sniff a spoofed
    // Content-Type into something executable (the upload MIME is client-set).
    const safeName = file.originalName.replace(/[\r\n"\\]/g, "_");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `inline; filename="${safeName}"`,
        "Content-Length": String(file.sizeBytes),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
