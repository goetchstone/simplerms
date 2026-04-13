// server/trpc/routers/users.ts
import "server-only";

import { createTRPCRouter, adminProcedure, protectedProcedure } from "@/server/trpc/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

const roleEnum = z.enum(["ADMIN", "STAFF", "READONLY"]);

export const usersRouter = createTRPCRouter({
  list: adminProcedure.query(({ ctx }) =>
    ctx.db.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    })
  ),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        role: roleEnum.default("STAFF"),
        password: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });

      const passwordHash = await bcrypt.hash(input.password, 12);

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          passwordHash,
        },
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      });

      return {
        ...user,
        _audit: { action: "users.create", entityType: "User", entityId: user.id },
      };
    }),

  updateRole: adminProcedure
    .input(z.object({ id: z.string().cuid(), role: roleEnum }))
    .mutation(async ({ ctx, input }) => {
      // Prevent removing the last admin.
      if (input.role !== "ADMIN") {
        const adminCount = await ctx.db.user.count({ where: { role: "ADMIN", isActive: true } });
        const target = await ctx.db.user.findUniqueOrThrow({ where: { id: input.id } });
        if (target.role === "ADMIN" && adminCount <= 1) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove the last admin" });
        }
      }
      const user = await ctx.db.user.update({
        where: { id: input.id },
        data: { role: input.role },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
      return {
        ...user,
        _audit: { action: "users.updateRole", entityType: "User", entityId: user.id },
      };
    }),

  setActive: adminProcedure
    .input(z.object({ id: z.string().cuid(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
      return {
        ...user,
        _audit: { action: "users.setActive", entityType: "User", entityId: user.id },
      };
    }),

  // Any authenticated user can update their own name/email.
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.email !== ctx.session.user.email) {
        const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
        if (existing && existing.id !== userId) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }
      }

      const before = await ctx.db.user.findUniqueOrThrow({
        where: { id: userId },
        select: { name: true, email: true },
      });

      const user = await ctx.db.user.update({
        where: { id: userId },
        data: { name: input.name, email: input.email },
        select: { id: true, name: true, email: true, role: true },
      });

      return {
        ...user,
        _audit: {
          action: "users.updateProfile",
          entityType: "User",
          entityId: user.id,
          before,
          after: { name: input.name, email: input.email },
        },
      };
    }),

  // Admin can update any user's name and email.
  update: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(255),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.user.findUniqueOrThrow({
        where: { id: input.id },
        select: { name: true, email: true },
      });

      if (input.email !== before.email) {
        const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
        if (existing && existing.id !== input.id) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }
      }

      const user = await ctx.db.user.update({
        where: { id: input.id },
        data: { name: input.name, email: input.email },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });

      return {
        ...user,
        _audit: {
          action: "users.update",
          entityType: "User",
          entityId: user.id,
          before,
          after: { name: input.name, email: input.email },
        },
      };
    }),

  // Staff can change their own password.
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { passwordHash: true },
      });

      if (!user.passwordHash) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No password set on this account" });
      }

      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect current password" });

      const newHash = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { passwordHash: newHash },
      });

      return { ok: true };
    }),
});
