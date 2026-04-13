// app/api/cron/overdue/route.ts
// Flags sent/viewed invoices as overdue when past due date.
// Called externally via cron (e.g. daily at midnight).
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.invoice.updateMany({
    where: {
      status: { in: ["SENT", "VIEWED", "PARTIAL"] },
      dueDate: { lt: new Date() },
    },
    data: { status: "OVERDUE" },
  });

  return NextResponse.json({ flagged: result.count });
}
