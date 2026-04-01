// server/trpc/routers/reports.ts
import "server-only";

import { createTRPCRouter, protectedProcedure } from "@/server/trpc/trpc";
import { z } from "zod";

export const reportsRouter = createTRPCRouter({
  // Revenue by month for a rolling 12-month window.
  revenueByMonth: protectedProcedure
    .input(z.object({ months: z.number().int().min(1).max(24).default(12) }))
    .query(async ({ ctx, input }) => {
      const from = new Date();
      from.setMonth(from.getMonth() - input.months + 1);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);

      const invoices = await ctx.db.invoice.findMany({
        where: {
          status: { in: ["PAID"] },
          paidAt: { gte: from },
        },
        select: { paidAt: true, total: true, currency: true },
      });

      // Group by YYYY-MM, sum totals (all treated as same currency for chart).
      const byMonth = new Map<string, number>();
      for (const inv of invoices) {
        const key = inv.paidAt!.toISOString().slice(0, 7);
        byMonth.set(key, (byMonth.get(key) ?? 0) + Number(inv.total));
      }

      // Fill every month in range even if zero.
      const months: { month: string; revenue: number }[] = [];
      const cursor = new Date(from);
      while (cursor <= new Date()) {
        const key = cursor.toISOString().slice(0, 7);
        months.push({ month: key, revenue: byMonth.get(key) ?? 0 });
        cursor.setMonth(cursor.getMonth() + 1);
      }

      return months;
    }),

  // Invoice aging — how much is outstanding and how old it is.
  invoiceAging: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const open = await ctx.db.invoice.findMany({
      where: { status: { in: ["SENT", "VIEWED", "PARTIAL", "OVERDUE"] } },
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        paidAmount: true,
        currency: true,
        dueDate: true,
        client: { select: { name: true } },
      },
    });

    return open.map((inv) => {
      const outstanding = Number(inv.total) - Number(inv.paidAmount);
      const daysOverdue = inv.dueDate
        ? Math.max(0, Math.floor((today.getTime() - inv.dueDate.getTime()) / 86400000))
        : 0;

      const bucket =
        daysOverdue === 0 ? "current"
        : daysOverdue <= 30 ? "1-30"
        : daysOverdue <= 60 ? "31-60"
        : daysOverdue <= 90 ? "61-90"
        : "90+";

      return { ...inv, outstanding, daysOverdue, bucket };
    });
  }),

  // Top clients by revenue (paid invoices).
  topClients: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.invoice.groupBy({
        by: ["clientId"],
        where: { status: "PAID" },
        _sum: { total: true },
        orderBy: { _sum: { total: "desc" } },
        take: input.limit,
      });

      const clientIds = rows.map((r) => r.clientId);
      const clients = await ctx.db.client.findMany({
        where: { id: { in: clientIds } },
        select: { id: true, name: true, company: true },
      });
      const clientMap = new Map(clients.map((c) => [c.id, c]));

      return rows.map((r) => ({
        client: clientMap.get(r.clientId)!,
        revenue: Number(r._sum.total ?? 0),
      }));
    }),

  // Ticket resolution stats.
  ticketStats: protectedProcedure.query(async ({ ctx }) => {
    const [byStatus, byPriority] = await Promise.all([
      ctx.db.ticket.groupBy({ by: ["status"], _count: { id: true } }),
      ctx.db.ticket.groupBy({ by: ["priority"], _count: { id: true } }),
    ]);

    // Avg resolution time in hours.
    const resolved = await ctx.db.ticket.findMany({
      where: { status: { in: ["RESOLVED", "CLOSED"] }, resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    });

    const avgHours =
      resolved.length === 0
        ? null
        : resolved.reduce((s, t) => s + (t.resolvedAt!.getTime() - t.createdAt.getTime()), 0) /
          resolved.length /
          3600000;

    return {
      byStatus: byStatus.map((r) => ({ status: r.status, count: r._count.id })),
      byPriority: byPriority.map((r) => ({ priority: r.priority, count: r._count.id })),
      avgResolutionHours: avgHours ? Math.round(avgHours) : null,
      totalOpen: byStatus.filter((r) => ["OPEN", "IN_PROGRESS"].includes(r.status)).reduce((s, r) => s + r._count.id, 0),
    };
  }),
});
