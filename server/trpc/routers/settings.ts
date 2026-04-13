// server/trpc/routers/settings.ts
import "server-only";

import { createTRPCRouter, adminProcedure } from "@/server/trpc/trpc";
import { z } from "zod";

const ALLOWED_KEYS = new Set([
  "company_name",
  "company_email",
  "company_phone",
  "company_address",
  "invoice_prefix",
  "default_currency",
  "default_due_days",
  "smtp_host",
  "smtp_port",
  "smtp_user",
  "smtp_pass",
  "email_from",
]);

const SECRET_KEYS = new Set(["smtp_pass"]);

export const settingsRouter = createTRPCRouter({
  // Admin-only: update one or many settings by key.
  upsert: adminProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ ctx, input }) => {
      const entries = Object.entries(input).filter(([k]) => ALLOWED_KEYS.has(k));
      await Promise.all(
        entries.map(([key, value]) =>
          ctx.db.setting.upsert({
            where: { key },
            create: { key, value, isSecret: SECRET_KEYS.has(key) },
            update: { value },
          })
        )
      );
      return { ok: true };
    }),
});
