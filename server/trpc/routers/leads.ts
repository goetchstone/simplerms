// server/trpc/routers/leads.ts
import "server-only";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createHmac } from "crypto";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";
import { sendEmail } from "@/server/email";

const SUBMIT_LIMIT = 3;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

const submitInput = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(80).optional(),
  company: z.string().max(120).optional(),
  source: z.string().min(1).max(80),
  // Honeypot — bots fill this, real users leave it blank
  website: z.string().max(0).optional().default(""),
});

// Generates a download token tied to the lead ID so the PDF URL works without
// the user being logged in but isn't trivially guessable. Not security-critical
// (the PDF is the same for every lead) — this just prevents random URL traversal.
function leadDownloadToken(leadId: string): string {
  const secret = process.env.AUTH_SECRET ?? "dev-secret";
  return createHmac("sha256", secret).update(leadId).digest("hex").slice(0, 16);
}

export const leadsRouter = createTRPCRouter({
  // Public: capture email and trigger PDF delivery.
  submit: publicProcedure.input(submitInput).mutation(async ({ ctx, input }) => {
    const ip =
      ctx.headers.get("x-forwarded-for") ??
      ctx.headers.get("x-real-ip") ??
      "unknown";

    if (input.website.length > 0) {
      // Honeypot — silently succeed so spammers can't tell
      return { ok: true };
    }

    const limit = rateLimit(`lead:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
    if (!limit.allowed) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again in an hour.",
      });
    }

    const email = input.email.trim().toLowerCase();

    // Upsert by email — same person can request the checklist multiple times,
    // we just want to know they came back. Don't dupe DB rows.
    const lead = await ctx.db.lead.upsert({
      where: { id: `${input.source}:${email}`.slice(0, 191) },
      update: {
        name: input.name?.trim(),
        company: input.company?.trim(),
        userAgent: ctx.headers.get("user-agent") ?? null,
      },
      create: {
        id: `${input.source}:${email}`.slice(0, 191),
        email,
        name: input.name?.trim(),
        company: input.company?.trim(),
        source: input.source,
        ipAddress: ip,
        userAgent: ctx.headers.get("user-agent") ?? null,
      },
    });

    const token = leadDownloadToken(lead.id);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akritos.com";
    const downloadUrl = `${baseUrl}/api/leads/checklist?id=${encodeURIComponent(lead.id)}&t=${token}`;

    // Fire-and-forget email — never blocks the form submit
    void sendEmail({
      to: email,
      subject: "Your Vendor Independence Checklist",
      text: [
        input.name ? `Hi ${input.name.split(" ")[0]},` : "Hi,",
        "",
        "Thanks for grabbing the checklist. Here's the download:",
        downloadUrl,
        "",
        "Work through it at your own pace. Most owners can't answer everything off the top of their head — that's normal, and the questions point at who in your world would know.",
        "",
        "If you'd like a 30-minute walkthrough together, no pitch, no pressure, you can book one here: https://akritos.com/book",
        "",
        "— Akritos",
      ].join("\n"),
      html: `<p>${input.name ? `Hi ${input.name.split(" ")[0]},` : "Hi,"}</p>
<p>Thanks for grabbing the checklist. Here's the download:</p>
<p><a href="${downloadUrl}">${downloadUrl}</a></p>
<p>Work through it at your own pace. Most owners can't answer everything off the top of their head — that's normal, and the questions point at who in your world would know.</p>
<p>If you'd like a 30-minute walkthrough together, no pitch, no pressure, you can <a href="https://akritos.com/book">book one here</a>.</p>
<p>— Akritos</p>`,
    }).catch(() => {
      // Email failure is logged but doesn't break the user flow
    });

    return { ok: true, downloadUrl };
  }),

  // Admin: list captured leads
  list: adminProcedure
    .input(
      z.object({
        source: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.source ? { source: input.source } : {};
      const [items, total] = await Promise.all([
        ctx.db.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.lead.count({ where }),
      ]);
      return { items, total, pages: Math.ceil(total / input.limit) };
    }),

  // Admin: count of recent leads (for nav badge)
  recentCount: adminProcedure.query(({ ctx }) => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return ctx.db.lead.count({ where: { createdAt: { gte: since } } });
  }),
});

// Exported helper so the PDF route can verify download tokens
export function verifyLeadDownloadToken(leadId: string, token: string): boolean {
  const expected = leadDownloadToken(leadId);
  return expected === token;
}
