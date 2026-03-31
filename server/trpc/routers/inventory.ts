// server/trpc/routers/inventory.ts
import "server-only";

import { createTRPCRouter, protectedProcedure } from "@/server/trpc/trpc";
import { z } from "zod";

export const inventoryRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        lowStock: z.boolean().default(false),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { lowStock, page, limit } = input;

      const items = await ctx.db.inventoryItem.findMany({
        include: {
          catalogItem: { select: { id: true, name: true, sku: true, unit: true } },
        },
        orderBy: { catalogItem: { name: "asc" } },
      });

      // Filter low-stock in memory — reorderPoint is nullable so SQL comparison is verbose.
      const filtered = lowStock
        ? items.filter((i) => i.reorderPoint !== null && i.qtyOnHand <= i.reorderPoint)
        : items;

      const total = filtered.length;
      const paged = filtered.slice((page - 1) * limit, page * limit);

      return { items: paged, total, pages: Math.ceil(total / limit) };
    }),

  byId: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.inventoryItem.findUniqueOrThrow({
        where: { id: input },
        include: {
          catalogItem: true,
          movements: { orderBy: { createdAt: "desc" }, take: 50 },
        },
      })
    ),

  // Adjust stock — positive delta = receiving, negative = consuming/writing off.
  adjust: protectedProcedure
    .input(
      z.object({
        inventoryItemId: z.string().cuid(),
        delta: z.number().int(),
        reason: z.string().min(1).max(500),
        reference: z.string().max(255).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [movement] = await ctx.db.$transaction([
        ctx.db.stockMovement.create({
          data: {
            inventoryItemId: input.inventoryItemId,
            delta: input.delta,
            reason: input.reason,
            reference: input.reference ?? null,
          },
        }),
        ctx.db.inventoryItem.update({
          where: { id: input.inventoryItemId },
          data: { qtyOnHand: { increment: input.delta } },
        }),
      ]);

      return {
        ...movement,
        _audit: {
          action: "inventory.adjust",
          entityType: "InventoryItem",
          entityId: input.inventoryItemId,
        },
      };
    }),

  upsertItem: protectedProcedure
    .input(
      z.object({
        catalogItemId: z.string().cuid(),
        reorderPoint: z.number().int().min(0).nullable().optional(),
        location: z.string().max(255).nullable().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.inventoryItem.upsert({
        where: { catalogItemId: input.catalogItemId },
        create: {
          catalogItemId: input.catalogItemId,
          reorderPoint: input.reorderPoint ?? null,
          location: input.location ?? null,
        },
        update: {
          ...(input.reorderPoint !== undefined && { reorderPoint: input.reorderPoint }),
          ...(input.location !== undefined && { location: input.location }),
        },
      })
    ),
});
