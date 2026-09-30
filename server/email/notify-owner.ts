// server/email/notify-owner.ts
import "server-only";
import { db } from "@/server/db";
import { sendEmail, type EmailPayload } from "@/server/email";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let warnedFallback = false;

// Settings → company_email, if it's a usable address. It's the business's
// public contact, so it's the only owner address shown to visitors.
export async function companyEmail(): Promise<string | undefined> {
  const value = (await db.setting.findUnique({ where: { key: "company_email" } }))?.value.trim();
  return value && EMAIL.test(value) ? value : undefined;
}

// The business inbox, else every active admin (oldest first, so the order is
// stable). The fallback is logged: admin login addresses are often unwatched.
export async function ownerRecipients(): Promise<string[]> {
  const company = await companyEmail();
  if (company) return [company];

  const admins = await db.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { email: true },
    orderBy: { createdAt: "asc" },
  });
  const emails = admins.map((a) => a.email);
  if (!warnedFallback) {
    warnedFallback = true;
    console.warn(`[email] company_email unset or invalid; owner notifications go to admin logins: ${emails.join(", ") || "none"}`);
  }
  return emails;
}

// Bookings, leads, and tickets used to land silently in the dashboard; a
// missing recipient is logged loudly rather than dropped.
export async function notifyOwner(payload: Omit<EmailPayload, "to">, recipients?: string[]): Promise<void> {
  const to = recipients ?? (await ownerRecipients());
  if (to.length === 0) {
    console.error(`[email] no owner recipient (set company_email in Settings): subject="${payload.subject}"`);
    return;
  }
  await sendEmail({ ...payload, to });
}
