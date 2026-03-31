// server/trpc/routers/tax.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/trpc/trpc";
import { taxRateSchema } from "@/lib/validations/tax";
import { z } from "zod";

export const taxRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ includeInactive: z.boolean().default(false) }))
    .query(({ ctx, input }) =>
      ctx.db.taxRate.findMany({
        where: input.includeInactive ? {} : { isActive: true },
        orderBy: [{ isCompound: "asc" }, { name: "asc" }],
      })
    ),

  create: adminProcedure
    .input(taxRateSchema)
    .mutation(async ({ ctx, input }) => {
      const { ratePercent, ...rest } = input;

      const taxRate = await ctx.db.taxRate.create({
        data: { ...rest, rate: ratePercent / 100 },
      });

      return {
        ...taxRate,
        _audit: {
          action: "tax.create",
          entityType: "TaxRate",
          entityId: taxRate.id,
          after: taxRate,
        },
      };
    }),

  update: adminProcedure
    .input(z.object({ id: z.string().cuid(), data: taxRateSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { ratePercent, ...rest } = input.data;

      const before = await ctx.db.taxRate.findUniqueOrThrow({
        where: { id: input.id },
      });

      const taxRate = await ctx.db.taxRate.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(ratePercent !== undefined && { rate: ratePercent / 100 }),
        },
      });

      return {
        ...taxRate,
        _audit: {
          action: "tax.update",
          entityType: "TaxRate",
          entityId: taxRate.id,
          before,
          after: taxRate,
        },
      };
    }),

  // Tax rates are never deleted — they are referenced in historical InvoiceLineTax rows.
  deactivate: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const taxRate = await ctx.db.taxRate.update({
        where: { id: input },
        data: { isActive: false },
      });

      return {
        ...taxRate,
        _audit: {
          action: "tax.deactivate",
          entityType: "TaxRate",
          entityId: taxRate.id,
        },
      };
    }),
});
