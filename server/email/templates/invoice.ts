// server/email/templates/invoice.ts
import { formatCurrency, formatDate } from "@/lib/utils";

export interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  issueDate: Date;
  dueDate?: Date | null;
  total: number;
  currency: string;
  paymentLink?: string | null;
  portalUrl: string;
  companyName: string;
}

export function invoiceEmailHtml(data: InvoiceEmailData): string {
  const { invoiceNumber, clientName, issueDate, dueDate, total, currency, paymentLink, portalUrl, companyName } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${invoiceNumber}</title>
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
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${clientName},</p>
              <p style="margin:0 0 32px;font-size:14px;color:#6b7280;">
                A new invoice has been issued. Please find the details below.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#6b7280;">Invoice</span>
                  </td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;font-weight:500;color:#111827;">${invoiceNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#6b7280;">Issued</span>
                  </td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#111827;">${formatDate(issueDate)}</span>
                  </td>
                </tr>
                ${dueDate ? `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#6b7280;">Due</span>
                  </td>
                  <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:13px;color:#111827;">${formatDate(dueDate)}</span>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:16px 0 0;">
                    <span style="font-size:15px;font-weight:600;color:#111827;">Total Due</span>
                  </td>
                  <td align="right" style="padding:16px 0 0;">
                    <span style="font-size:15px;font-weight:600;color:#111827;">${formatCurrency(total, currency)}</span>
                  </td>
                </tr>
              </table>

              ${paymentLink ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${paymentLink}"
                       style="display:inline-block;padding:12px 32px;background:#111827;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      Pay now
                    </a>
                  </td>
                </tr>
              </table>` : ""}

              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                <a href="${portalUrl}" style="color:#6b7280;">View invoice</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by ${companyName}. Questions? Reply to this email.
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

export function invoiceEmailText(data: InvoiceEmailData): string {
  const { invoiceNumber, clientName, issueDate, dueDate, total, currency, paymentLink, portalUrl, companyName } = data;
  return [
    `${companyName}`,
    ``,
    `Hi ${clientName},`,
    ``,
    `Invoice ${invoiceNumber} — ${formatCurrency(total, currency)}`,
    `Issued: ${formatDate(issueDate)}`,
    dueDate ? `Due: ${formatDate(dueDate)}` : null,
    ``,
    paymentLink ? `Pay now: ${paymentLink}` : null,
    `View invoice: ${portalUrl}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
