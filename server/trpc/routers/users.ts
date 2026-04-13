// server/trpc/routers/users.ts
import "server-only";

import { createTRPCRouter, adminProcedure, protectedProcedure, publicProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";
import { sendEmail } from "@/server/email";
import { passwordResetHtml, passwordResetText } from "@/server/email/templates/password-reset";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

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

  // Public — request a password reset email. Always returns success to prevent email enumeration.
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const ip = ctx.headers.get("x-forwarded-for") ?? ctx.headers.get("x-real-ip") ?? "unknown";
      const { allowed } = rateLimit(`pw-reset:${ip}`, 5, 900000);
      if (!allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Please try again later." });

      const user = await ctx.db.user.findUnique({ where: { email: input.email, isActive: true } });

      // Always return success — don't reveal whether the email exists.
      if (!user) return { ok: true };

      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Remove any existing reset tokens for this user.
      await ctx.db.verificationToken.deleteMany({ where: { identifier: user.email } });

      await ctx.db.verificationToken.create({
        data: { identifier: user.email, token, expires },
      });

      const companyName = (await ctx.db.setting.findUnique({ where: { key: "company_name" } }))?.value ?? "Akritos";
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      sendEmail({
        to: user.email,
        subject: `Reset your ${companyName} password`,
        html: passwordResetHtml({ resetUrl, companyName, expiresInMinutes: 60 }),
        text: passwordResetText({ resetUrl, companyName, expiresInMinutes: 60 }),
      }).catch(() => {});

      return { ok: true };
    }),

  // Public — reset password using a valid token.
  resetPassword: publicProcedure
    .input(z.object({ token: z.string().min(1), newPassword: z.string().min(8).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.verificationToken.findUnique({ where: { token: input.token } });
      if (!record || record.expires < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired reset link. Please request a new one." });
      }

      const user = await ctx.db.user.findUnique({ where: { email: record.identifier, isActive: true } });
      if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired reset link." });

      const passwordHash = await bcrypt.hash(input.newPassword, 12);

      await ctx.db.$transaction([
        ctx.db.user.update({ where: { id: user.id }, data: { passwordHash } }),
        ctx.db.verificationToken.delete({ where: { token: input.token } }),
      ]);

      return { ok: true };
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
