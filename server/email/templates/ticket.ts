// server/email/templates/ticket.ts

export interface TicketConfirmationData {
  ticketNumber: string;
  subject: string;
  submitterName: string;
  trackUrl: string;
  companyName: string;
}

export function ticketConfirmationHtml(data: TicketConfirmationData): string {
  const { ticketNumber, subject, submitterName, trackUrl, companyName } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${ticketNumber} — Ticket received</title>
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
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${submitterName},</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                We received your request and created ticket <strong>${ticketNumber}</strong>.
              </p>
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Subject:</p>
              <p style="margin:0 0 32px;font-size:14px;font-weight:500;color:#111827;">${subject}</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${trackUrl}"
                       style="display:inline-block;padding:12px 32px;background:#111827;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      Track your ticket
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                We'll follow up shortly. You can check the status anytime using the link above.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by ${companyName}. Reply to this email if you have additional details.
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

export function ticketConfirmationText(data: TicketConfirmationData): string {
  const { ticketNumber, subject, submitterName, trackUrl, companyName } = data;
  return [
    companyName,
    "",
    `Hi ${submitterName},`,
    "",
    `We received your request and created ticket ${ticketNumber}.`,
    "",
    `Subject: ${subject}`,
    "",
    `Track your ticket: ${trackUrl}`,
  ].join("\n");
}

export interface TicketReplyData {
  ticketNumber: string;
  subject: string;
  submitterName: string;
  replyBody: string;
  replierName: string;
  trackUrl: string;
  companyName: string;
}

export function ticketReplyHtml(data: TicketReplyData): string {
  const { ticketNumber, subject, submitterName, replyBody, replierName, trackUrl, companyName } = data;
  // Escape HTML in the reply body to prevent injection.
  const safeBody = replyBody.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Re: [${ticketNumber}] ${subject}</title>
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
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${submitterName},</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                ${replierName} replied to your ticket <strong>${ticketNumber}</strong>:
              </p>
              <div style="padding:16px;background:#f3f4f6;border-radius:6px;margin-bottom:32px;">
                <p style="margin:0;font-size:14px;color:#111827;line-height:1.6;">${safeBody}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${trackUrl}"
                       style="display:inline-block;padding:12px 32px;background:#111827;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      View full conversation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by ${companyName}. Reply to this email to respond.
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

export function ticketReplyText(data: TicketReplyData): string {
  const { ticketNumber, subject, submitterName, replyBody, replierName, trackUrl, companyName } = data;
  return [
    companyName,
    "",
    `Hi ${submitterName},`,
    "",
    `${replierName} replied to your ticket ${ticketNumber} (${subject}):`,
    "",
    replyBody,
    "",
    `View conversation: ${trackUrl}`,
  ].join("\n");
}
