// server/trpc/routers/timeTracking.ts
import "server-only";

import { createTRPCRouter, protectedProcedure } from "@/server/trpc/trpc";
import { z } from "zod";

export const timeTrackingRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        clientId: z.string().cuid().optional(),
        userId: z.string().cuid().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        billableOnly: z.boolean().default(false),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, userId, from, to, billableOnly, page, limit } = input;
      const where = {
        ...(clientId && { clientId }),
        ...(userId && { userId }),
        ...(billableOnly && { isBillable: true }),
        ...(from && { date: { gte: from } }),
        ...(to && { date: { lte: to } }),
      };

      const [items, total] = await Promise.all([
        ctx.db.timeEntry.findMany({
          where,
          orderBy: { date: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } },
          },
        }),
        ctx.db.timeEntry.count({ where }),
      ]);

      const totalMinutes = items.reduce((s, e) => s + e.minutes, 0);

      return { items, total, pages: Math.ceil(total / limit), totalMinutes };
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string().cuid().optional().nullable(),
        description: z.string().min(1).max(1000),
        minutes: z.number().int().min(1).max(1440),
        date: z.coerce.date(),
        isBillable: z.boolean().default(true),
        invoiceId: z.string().cuid().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.timeEntry.create({
        data: {
          userId: ctx.session.user.id,
          clientId: input.clientId ?? null,
          description: input.description,
          minutes: input.minutes,
          date: input.date,
          isBillable: input.isBillable,
          invoiceId: input.invoiceId ?? null,
        },
      });

      return {
        ...entry,
        _audit: { action: "time.create", entityType: "TimeEntry", entityId: entry.id },
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        description: z.string().min(1).max(1000).optional(),
        minutes: z.number().int().min(1).max(1440).optional(),
        date: z.coerce.date().optional(),
        isBillable: z.boolean().optional(),
        invoiceId: z.string().cuid().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const entry = await ctx.db.timeEntry.update({ where: { id }, data });
      return {
        ...entry,
        _audit: { action: "time.update", entityType: "TimeEntry", entityId: id },
      };
    }),

  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.timeEntry.delete({ where: { id: input } });
      return {
        id: input,
        _audit: { action: "time.delete", entityType: "TimeEntry", entityId: input },
      };
    }),

  // Summary for a client or user — total billable minutes, grouped by client.
  summary: protectedProcedure
    .input(
      z.object({
        clientId: z.string().cuid().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, from, to } = input;
      const entries = await ctx.db.timeEntry.findMany({
        where: {
          ...(clientId && { clientId }),
          ...(from && { date: { gte: from } }),
          ...(to && { date: { lte: to } }),
        },
        include: { client: { select: { id: true, name: true } } },
      });

      const byClient = new Map<string, { clientId: string; clientName: string; minutes: number; billableMinutes: number }>();
      for (const e of entries) {
        const key = e.clientId ?? "__none";
        const existing = byClient.get(key) ?? {
          clientId: e.clientId ?? "",
          clientName: e.client?.name ?? "No client",
          minutes: 0,
          billableMinutes: 0,
        };
        existing.minutes += e.minutes;
        if (e.isBillable) existing.billableMinutes += e.minutes;
        byClient.set(key, existing);
      }

      return {
        rows: [...byClient.values()],
        totalMinutes: entries.reduce((s, e) => s + e.minutes, 0),
        billableMinutes: entries.filter((e) => e.isBillable).reduce((s, e) => s + e.minutes, 0),
      };
    }),
});
