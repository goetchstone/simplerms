// server/email/index.ts
import "server-only";
import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: parseInt(process.env.SMTP_PORT ?? "1025", 10),
    secure: process.env.SMTP_SECURE === "true",
    ...(process.env.SMTP_USER && {
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  });
}

// Singleton — transport is reused across requests.
const transport = createTransport();

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "SimpleRMS <noreply@example.com>",
    ...payload,
  });
}
