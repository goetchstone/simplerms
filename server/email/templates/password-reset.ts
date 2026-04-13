// server/email/templates/password-reset.ts

export interface PasswordResetData {
  resetUrl: string;
  companyName: string;
  expiresInMinutes: number;
}

export function passwordResetHtml(data: PasswordResetData): string {
  const { resetUrl, companyName, expiresInMinutes } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your password</title>
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
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi,</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                We received a request to reset your password. Click the button below to choose a new one.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:12px 32px;background:#111827;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;text-align:center;">
                This link expires in ${expiresInMinutes} minutes.
              </p>
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                If you didn't request this, you can safely ignore this email.
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

export function passwordResetText(data: PasswordResetData): string {
  const { resetUrl, companyName, expiresInMinutes } = data;
  return [
    companyName,
    "",
    "Hi,",
    "",
    "We received a request to reset your password. Visit the link below to choose a new one:",
    "",
    resetUrl,
    "",
    `This link expires in ${expiresInMinutes} minutes.`,
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");
}
