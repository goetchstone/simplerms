// server/trpc/routers/portal.ts
import "server-only";

import { createTRPCRouter, publicProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const portalRouter = createTRPCRouter({
  // Validate token and return client summary.
  validate: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const ip = ctx.headers.get("x-forwarded-for") ?? ctx.headers.get("x-real-ip") ?? "unknown";
      const { allowed } = rateLimit(`portal:${ip}`, 30, 60000);
      if (!allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const client = await ctx.db.client.findUnique({
        where: { portalToken: input, isActive: true },
        select: {
          id: true,
          name: true,
          company: true,
          _count: { select: { invoices: true, tickets: true, appointments: true } },
        },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      return client;
    }),

  invoices: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { portalToken: input, isActive: true },
        select: { id: true },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.invoice.findMany({
        where: { clientId: client.id, status: { notIn: ["DRAFT", "VOID"] } },
        orderBy: { issueDate: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          issueDate: true,
          dueDate: true,
          total: true,
          paidAmount: true,
          currency: true,
          publicToken: true,
          stripePaymentLink: true,
        },
      });
    }),

  tickets: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { portalToken: input, isActive: true },
        select: { id: true },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.ticket.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticketNumber: true,
          subject: true,
          status: true,
          priority: true,
          publicToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  appointments: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { portalToken: input, isActive: true },
        select: { id: true },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.appointment.findMany({
        where: { clientId: client.id },
        orderBy: { startsAt: "desc" },
        include: {
          service: { select: { name: true } },
        },
      });
    }),
});
