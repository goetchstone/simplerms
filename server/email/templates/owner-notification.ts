// server/email/templates/owner-notification.ts
import { escapeHtml } from "@/server/email/escape";

export interface OwnerNotification {
  heading: string;
  rows: Array<[label: string, value: string | null | undefined]>;
  link?: { href: string; label: string };
}

const present = (rows: OwnerNotification["rows"]) =>
  rows.filter((r): r is [string, string] => Boolean(r[1]));

export function ownerNotificationHtml(n: OwnerNotification): string {
  const rows = present(n.rows)
    .map(
      ([label, value]) => `<tr>
          <td style="padding:8px 16px 8px 0;font-size:13px;color:#6b7280;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:13px;color:#111827;">${escapeHtml(value).replace(/\r?\n/g, "<br />")}</td>
        </tr>`
    )
    .join("");
  const link = n.link
    ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(n.link.href)}" style="color:#111827;">${escapeHtml(n.link.label)}</a></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>${escapeHtml(n.heading)}</title></head>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <p style="margin:0 0 16px;font-size:18px;font-weight:600;">${escapeHtml(n.heading)}</p>
  <table cellpadding="0" cellspacing="0">${rows}</table>
  ${link}
</body>
</html>`;
}

export function ownerNotificationText(n: OwnerNotification): string {
  return [
    n.heading,
    "",
    ...present(n.rows).map(([label, value]) => `${label}: ${value}`),
    ...(n.link ? ["", `${n.link.label}: ${n.link.href}`] : []),
  ].join("\n");
}
