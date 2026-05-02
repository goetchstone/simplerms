// app/api/leads/checklist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { renderChecklistPdf } from "@/server/pdf/checklist";
import { verifyLeadDownloadToken } from "@/server/trpc/routers/leads";

// Token-gated PDF download. Token is HMAC of leadId — predictable to anyone
// who's already received the email, opaque to a random URL guesser. The PDF
// itself is the same for everyone; this just keeps it from being trivially
// hot-linked or scraped.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const token = searchParams.get("t");

  if (!id || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!verifyLeadDownloadToken(id, token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Mark download — useful engagement signal in the admin view
  await db.lead
    .update({ where: { id }, data: { downloadedAt: new Date() } })
    .catch(() => {
      // Lead might not exist; we still serve the PDF (token was valid)
    });

  const buffer = await renderChecklistPdf();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="vendor-independence-checklist.pdf"',
      // Don't cache at the edge — we want every request to mark engagement
      "Cache-Control": "private, no-store",
    },
  });
}
