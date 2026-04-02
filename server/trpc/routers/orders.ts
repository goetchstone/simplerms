// server/trpc/routers/orders.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure } from "@/server/trpc/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const orderLineSchema = z.object({
  catalogItemId: z.string().cuid().optional().nullable(),
  description: z.string().min(1).max(1000),
  quantity: z.number().int().positive(),
  unitPrice: z.number().min(0).multipleOf(0.01),
});

const orderStatusEnum = z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "FULFILLED", "CANCELLED"]);

export const ordersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        clientId: z.string().cuid().optional(),
        status: orderStatusEnum.optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, status, page, limit } = input;
      const where = {
        ...(clientId && { clientId }),
        ...(status && { status }),
      };

      const [items, total] = await Promise.all([
        ctx.db.order.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            client: { select: { id: true, name: true, company: true } },
            _count: { select: { lines: true } },
          },
        }),
        ctx.db.order.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  byId: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.order.findUniqueOrThrow({
        where: { id: input },
        include: {
          client: true,
          lines: { include: { catalogItem: { select: { id: true, name: true, sku: true } } } },
        },
      })
    ),

  create: staffProcedure
    .input(
      z.object({
        clientId: z.string().cuid(),
        notes: z.string().max(5000).optional().nullable(),
        lines: z.array(orderLineSchema).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Atomic number generation to prevent race conditions.
      const order = await ctx.db.$transaction(async (tx) => {
        const count = await tx.order.count();
        const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

        return tx.order.create({
          data: {
            orderNumber,
            clientId: input.clientId,
            notes: input.notes ?? null,
            lines: { create: input.lines },
          },
          include: { lines: true },
        });
      });

      await ctx.db.activityLog.create({
        data: {
          clientId: input.clientId,
          type: "order.created",
          summary: `Order ${order.orderNumber} created`,
        },
      });

      return {
        ...order,
        _audit: { action: "orders.create", entityType: "Order", entityId: order.id },
      };
    }),

  updateStatus: staffProcedure
    .input(z.object({ id: z.string().cuid(), status: orderStatusEnum }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      return {
        ...order,
        _audit: { action: "orders.updateStatus", entityType: "Order", entityId: order.id },
      };
    }),

  // Attach an existing invoice to an order (or detach by passing null).
  linkInvoice: staffProcedure
    .input(z.object({ id: z.string().cuid(), invoiceId: z.string().cuid().nullable() }))
    .mutation(({ ctx, input }) =>
      ctx.db.order.update({
        where: { id: input.id },
        data: { invoiceId: input.invoiceId },
      })
    ),
});
