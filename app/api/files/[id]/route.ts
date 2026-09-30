// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { getFile } from "@/server/storage/local";
import { contentDisposition } from "@/lib/content-disposition";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const file = await db.file.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let buffer: Buffer;
  try {
    buffer = await getFile(file.storagePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }
    throw err;
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": contentDisposition("inline", file.originalName),
      "Content-Length": String(file.sizeBytes),
      // The upload MIME type is client-set; nosniff stops a browser from
      // sniffing a spoofed type into something executable.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
