// server/trpc/routers/catalog.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure } from "@/server/trpc/trpc";
import { catalogItemSchema } from "@/lib/validations/catalog";
import { z } from "zod";

export const catalogRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        includeInactive: z.boolean().default(false),
        type: z.enum(["SERVICE", "PRODUCT", "DIGITAL"]).optional(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.db.catalogItem.findMany({
        where: {
          ...(input.includeInactive ? {} : { isActive: true }),
          ...(input.type && { type: input.type }),
        },
        orderBy: { name: "asc" },
        include: { inventoryItem: true },
      })
    ),

  byId: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.catalogItem.findUniqueOrThrow({
        where: { id: input },
        include: { inventoryItem: true },
      })
    ),

  create: staffProcedure
    .input(catalogItemSchema)
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.catalogItem.create({
        data: {
          ...input,
          unitPrice: input.unitPrice,
        },
      });

      return {
        ...item,
        _audit: {
          action: "catalog.create",
          entityType: "CatalogItem",
          entityId: item.id,
          after: item,
        },
      };
    }),

  update: staffProcedure
    .input(z.object({ id: z.string().cuid(), data: catalogItemSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.catalogItem.findUniqueOrThrow({
        where: { id: input.id },
      });

      const item = await ctx.db.catalogItem.update({
        where: { id: input.id },
        data: input.data,
      });

      return {
        ...item,
        _audit: {
          action: "catalog.update",
          entityType: "CatalogItem",
          entityId: item.id,
          before,
          after: item,
        },
      };
    }),

  archive: staffProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.catalogItem.update({
        where: { id: input },
        data: { isActive: false },
      });

      return {
        ...item,
        _audit: {
          action: "catalog.archive",
          entityType: "CatalogItem",
          entityId: item.id,
        },
      };
    }),
});
