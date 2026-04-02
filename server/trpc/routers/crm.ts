// server/trpc/routers/crm.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure } from "@/server/trpc/trpc";
import { clientSchema, contactSchema } from "@/lib/validations/client";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const crmRouter = createTRPCRouter({
  // ── Clients ──────────────────────────────────────────────────────────────

  listClients: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        includeInactive: z.boolean().default(false),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, includeInactive, page, limit } = input;

      const where = {
        ...(includeInactive ? {} : { isActive: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.client.findMany({
          where,
          orderBy: { name: "asc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            tags: { include: { tag: true } },
            _count: { select: { invoices: true, tickets: true } },
          },
        }),
        ctx.db.client.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  clientById: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.client.findUniqueOrThrow({
        where: { id: input },
        include: {
          contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
          tags: { include: { tag: true } },
          notes_rel: { orderBy: { createdAt: "desc" }, take: 20 },
          activityLog: { orderBy: { createdAt: "desc" }, take: 50 },
          _count: {
            select: { invoices: true, tickets: true, orders: true, appointments: true },
          },
        },
      })
    ),

  createClient: staffProcedure
    .input(clientSchema)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input;
      const client = await ctx.db.client.create({
        data: {
          ...rest,
          address: address === null ? Prisma.JsonNull : address,
        },
      });

      await ctx.db.activityLog.create({
        data: {
          clientId: client.id,
          type: "client.created",
          summary: "Client created",
        },
      });

      return {
        ...client,
        _audit: {
          action: "crm.client.create",
          entityType: "Client",
          entityId: client.id,
          after: client,
        },
      };
    }),

  updateClient: staffProcedure
    .input(z.object({ id: z.string().cuid(), data: clientSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.client.findUniqueOrThrow({
        where: { id: input.id },
      });

      const { address, ...rest } = input.data;
      const client = await ctx.db.client.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(address !== undefined && { address: address === null ? Prisma.JsonNull : address }),
        },
      });

      await ctx.db.activityLog.create({
        data: {
          clientId: client.id,
          type: "client.updated",
          summary: "Client details updated",
        },
      });

      return {
        ...client,
        _audit: {
          action: "crm.client.update",
          entityType: "Client",
          entityId: client.id,
          before,
          after: client,
        },
      };
    }),

  addNote: staffProcedure
    .input(z.object({ clientId: z.string().cuid(), content: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.note.create({ data: input });

      await ctx.db.activityLog.create({
        data: {
          clientId: input.clientId,
          type: "note.added",
          summary: "Note added",
        },
      });

      return note;
    }),

  // ── Contacts ─────────────────────────────────────────────────────────────

  createContact: staffProcedure
    .input(contactSchema)
    .mutation(async ({ ctx, input }) => {
      // Only one primary contact per client.
      if (input.isPrimary) {
        await ctx.db.contact.updateMany({
          where: { clientId: input.clientId },
          data: { isPrimary: false },
        });
      }

      const contact = await ctx.db.contact.create({ data: input });

      return {
        ...contact,
        _audit: {
          action: "crm.contact.create",
          entityType: "Contact",
          entityId: contact.id,
        },
      };
    }),

  updateContact: staffProcedure
    .input(z.object({ id: z.string().cuid(), data: contactSchema.omit({ clientId: true }).partial() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.contact.findUniqueOrThrow({
        where: { id: input.id },
      });

      if (input.data.isPrimary) {
        await ctx.db.contact.updateMany({
          where: { clientId: existing.clientId, id: { not: input.id } },
          data: { isPrimary: false },
        });
      }

      const contact = await ctx.db.contact.update({
        where: { id: input.id },
        data: input.data,
      });

      return {
        ...contact,
        _audit: {
          action: "crm.contact.update",
          entityType: "Contact",
          entityId: contact.id,
        },
      };
    }),

  deleteContact: staffProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contact.delete({ where: { id: input } });

      return {
        id: input,
        _audit: { action: "crm.contact.delete", entityType: "Contact", entityId: input },
      };
    }),
});
