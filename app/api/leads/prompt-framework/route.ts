// app/api/leads/prompt-framework/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { renderFrameworkPdf } from "@/server/pdf/framework";
import { verifyLeadDownloadToken } from "@/server/trpc/routers/leads";

// Token-gated PDF download. Same pattern as /api/leads/checklist.
// Token is HMAC of leadId — predictable to anyone who's already received
// the email, opaque to a random URL guesser.
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

  await db.lead
    .update({ where: { id }, data: { downloadedAt: new Date() } })
    .catch(() => {
      // Lead might not exist; we still serve the PDF (token was valid)
    });

  const buffer = await renderFrameworkPdf();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="ai-prompt-framework.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
