// server/email/templates/appointment-reminder.ts
import { formatDate } from "@/lib/utils";

export interface AppointmentReminderData {
  serviceName: string;
  bookerName: string;
  startsAt: Date;
  timezone: string;
  cancelUrl: string;
  companyName: string;
}

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

export function appointmentReminderHtml(data: AppointmentReminderData): string {
  const { serviceName, bookerName, startsAt, timezone, cancelUrl, companyName } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Appointment reminder</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">${companyName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${bookerName},</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                This is a reminder that your appointment for <strong>${serviceName}</strong> is coming up tomorrow.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#6b7280;">Date</span>
                  </td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#111827;">${formatDate(startsAt)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:13px;color:#6b7280;">Time</span>
                  </td>
                  <td align="right" style="padding:12px 0;">
                    <span style="font-size:13px;color:#111827;">${formatTime(startsAt, timezone)}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                Need to cancel? <a href="${cancelUrl}" style="color:#6b7280;">Cancel this appointment</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by ${companyName}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function appointmentReminderText(data: AppointmentReminderData): string {
  const { serviceName, bookerName, startsAt, timezone, cancelUrl, companyName } = data;
  return [
    companyName,
    "",
    `Hi ${bookerName},`,
    "",
    `Reminder: your appointment for ${serviceName} is coming up tomorrow.`,
    "",
    `Date: ${formatDate(startsAt)}`,
    `Time: ${formatTime(startsAt, timezone)}`,
    "",
    `Need to cancel? ${cancelUrl}`,
  ].join("\n");
}
