// server/email/index.ts
import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { db } from "@/server/db";

// SMTP credentials live in the Settings table — set via /dashboard/settings.
// Env vars are the dev fallback (Mailpit at localhost:1025) and the
// emergency override if the DB is unreachable. Production should always
// use Settings so SMTP can be rotated without redeploying.

const SMTP_KEYS = [
  "smtp_host",
  "smtp_port",
  "smtp_user",
  "smtp_pass",
  "email_from",
] as const;

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

interface CachedTransport {
  transport: Transporter;
  from: string;
  configKey: string; // Used to detect when Settings change and rebuild transport
  expiresAt: number;
}

// Cache the built transport for 60s so we're not rebuilding it on every email.
// 60s is short enough that Settings changes propagate fast; long enough that
// burst sends (e.g., a cron processing 50 queued emails) don't hammer the DB.
const CACHE_TTL_MS = 60 * 1000;
let cached: CachedTransport | null = null;

async function loadSmtpConfig(): Promise<SmtpConfig> {
  let dbValues: Record<string, string> = {};
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: [...SMTP_KEYS] } },
      select: { key: true, value: true },
    });
    dbValues = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    // DB unreachable — fall through to env vars
  }

  return {
    host: dbValues.smtp_host || process.env.SMTP_HOST || "localhost",
    port: parseInt(dbValues.smtp_port || process.env.SMTP_PORT || "1025", 10),
    user: dbValues.smtp_user || process.env.SMTP_USER || "",
    pass: dbValues.smtp_pass || process.env.SMTP_PASS || "",
    from:
      dbValues.email_from ||
      process.env.EMAIL_FROM ||
      "Akritos <noreply@example.com>",
  };
}

async function getTransport(): Promise<{ transport: Transporter; from: string }> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return { transport: cached.transport, from: cached.from };
  }

  const cfg = await loadSmtpConfig();
  const configKey = `${cfg.host}:${cfg.port}:${cfg.user}:${cfg.pass}`;

  // Reuse the existing transport if Settings haven't changed.
  // Just refresh the cache window.
  if (cached && cached.configKey === configKey) {
    cached.expiresAt = now + CACHE_TTL_MS;
    return { transport: cached.transport, from: cfg.from };
  }

  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    // Port 465 is implicit TLS; everything else uses STARTTLS or plain
    secure: cfg.port === 465,
    ...(cfg.user && {
      auth: { user: cfg.user, pass: cfg.pass },
    }),
  });

  cached = {
    transport,
    from: cfg.from,
    configKey,
    expiresAt: now + CACHE_TTL_MS,
  };
  return { transport, from: cfg.from };
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { transport, from } = await getTransport();
  try {
    await transport.sendMail({ from, ...payload });
  } catch (err) {
    // Email failures upstream are usually swallowed by callers (.catch(()=>{})
    // for fire-and-forget). Log here so the failure shows up in container logs
    // even when the caller suppresses it.
    const to = Array.isArray(payload.to) ? payload.to.join(",") : payload.to;
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[email] FAILED to=${to} subject="${payload.subject}" error=${message}`
    );
    throw err;
  }
}

// Verify the SMTP transport works without sending an email. Useful for an
// admin "Test SMTP" button or a health check. Returns null on success or the
// error message on failure.
export async function verifySmtp(): Promise<string | null> {
  const { transport } = await getTransport();
  try {
    await transport.verify();
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}
