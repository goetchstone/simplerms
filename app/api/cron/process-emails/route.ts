// app/api/cron/process-emails/route.ts
// Processes the EmailQueue table — sends pending emails, retries failures.
// Called externally via cron (e.g. every 5 minutes).
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { sendEmail } from "@/server/email";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 20;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await db.emailQueue.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { lte: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { scheduledAt: "asc" },
    take: BATCH_SIZE,
  });

  if (pending.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const email of pending) {
    try {
      // templateData stores pre-rendered html/text for simplicity.
      const data = email.templateData as { html?: string; text?: string };

      await sendEmail({
        to: email.to,
        subject: email.subject,
        html: data.html ?? "",
        text: data.text,
      });

      await db.emailQueue.update({
        where: { id: email.id },
        data: { status: "SENT", sentAt: new Date(), attempts: email.attempts + 1 },
      });
      sent++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const newAttempts = email.attempts + 1;

      await db.emailQueue.update({
        where: { id: email.id },
        data: {
          attempts: newAttempts,
          lastError: errorMessage,
          status: newAttempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING",
        },
      });
      failed++;
    }
  }

  return NextResponse.json({ processed: pending.length, sent, failed });
}
