// app/api/cron/reminders/route.ts
// Called externally via cron (e.g. every 15 minutes) to send appointment reminders.
// Protected by CRON_SECRET env var — not publicly accessible.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { sendEmail } from "@/server/email";
import {
  appointmentReminderHtml,
  appointmentReminderText,
} from "@/server/email/templates/appointment-reminder";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Find confirmed appointments in the next 24 hours that haven't had a reminder sent.
  const appointments = await db.appointment.findMany({
    where: {
      status: "CONFIRMED",
      startsAt: { gt: now, lte: in24h },
      reminderSentAt: null,
    },
    include: {
      service: { select: { name: true } },
    },
  });

  if (appointments.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const companyName =
    (await db.setting.findUnique({ where: { key: "company_name" } }))?.value ??
    "Akritos";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let sent = 0;

  for (const appt of appointments) {
    const cancelUrl = `${baseUrl}/book/cancel?token=${appt.cancelToken}`;

    try {
      await sendEmail({
        to: appt.bookerEmail,
        subject: `Reminder: ${appt.service.name} tomorrow`,
        html: appointmentReminderHtml({
          serviceName: appt.service.name,
          bookerName: appt.bookerName,
          startsAt: appt.startsAt,
          timezone: appt.timezone,
          cancelUrl,
          companyName,
        }),
        text: appointmentReminderText({
          serviceName: appt.service.name,
          bookerName: appt.bookerName,
          startsAt: appt.startsAt,
          timezone: appt.timezone,
          cancelUrl,
          companyName,
        }),
      });

      await db.appointment.update({
        where: { id: appt.id },
        data: { reminderSentAt: new Date() },
      });

      sent++;
    } catch {
      // Log failure but continue with remaining appointments.
    }
  }

  return NextResponse.json({ sent, total: appointments.length });
}
