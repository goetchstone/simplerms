// server/trpc/routers/audit.ts
import "server-only";

import { createTRPCRouter, adminProcedure } from "@/server/trpc/trpc";
import { z } from "zod";

export const auditRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
        userId: z.string().optional(),
        entityType: z.string().optional(),
        entityId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, userId, entityType, entityId } = input;
      const where = {
        ...(userId && { userId }),
        ...(entityType && { entityType }),
        ...(entityId && { entityId }),
      };

      const [items, total] = await Promise.all([
        ctx.db.auditLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: { user: { select: { id: true, name: true, email: true } } },
        }),
        ctx.db.auditLog.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),
});
