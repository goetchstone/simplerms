// server/trpc/routers/comments.ts
import "server-only";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";

// Public submission limits — tuned for honest commenters, hostile to spam farms.
const SUBMIT_LIMIT = 3;
const SUBMIT_WINDOW_MS = 15 * 60 * 1000;

const submitInput = z.object({
  postId: z.string().cuid(),
  authorName: z.string().min(1).max(80),
  authorEmail: z.string().email().max(254),
  content: z.string().min(10).max(2000),
  // Honeypot — real users leave this empty; bots fill every form field they see.
  // Server treats any non-empty value as spam; client must keep this hidden + unlabeled.
  website: z.string().max(0).optional().default(""),
});

export const commentsRouter = createTRPCRouter({
  // Public read of approved comments for a post.
  listForPost: publicProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(({ ctx, input }) =>
      ctx.db.blogComment.findMany({
        where: { postId: input.postId, status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          authorName: true,
          content: true,
          createdAt: true,
        },
      })
    ),

  // Public submission. Returns ok regardless of honeypot trip so spammers can't
  // distinguish "blocked" from "accepted" — they get the same success response.
  submit: publicProcedure.input(submitInput).mutation(async ({ ctx, input }) => {
    const ip =
      ctx.headers.get("x-forwarded-for") ??
      ctx.headers.get("x-real-ip") ??
      "unknown";

    if (input.website.length > 0) {
      // Honeypot tripped. Silently drop.
      return { ok: true };
    }

    const limit = rateLimit(`comment:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
    if (!limit.allowed) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many comments from this address. Try again later.",
      });
    }

    const post = await ctx.db.cmsPost.findUnique({
      where: { id: input.postId, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    await ctx.db.blogComment.create({
      data: {
        postId: input.postId,
        authorName: input.authorName.trim(),
        authorEmail: input.authorEmail.trim().toLowerCase(),
        content: input.content.trim(),
        status: "PENDING",
        ipAddress: ip,
        userAgent: ctx.headers.get("user-agent") ?? null,
      },
    });

    return { ok: true };
  }),

  // Admin: list pending comments for moderation.
  listPending: adminProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]).default("PENDING"),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = { status: input.status };
      const [items, total] = await Promise.all([
        ctx.db.blogComment.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: { post: { select: { title: true, slug: true } } },
        }),
        ctx.db.blogComment.count({ where }),
      ]);
      return { items, total, pages: Math.ceil(total / input.limit) };
    }),

  approve: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.blogComment.findUnique({ where: { id: input.id } });
      if (!before) throw new TRPCError({ code: "NOT_FOUND" });

      const after = await ctx.db.blogComment.update({
        where: { id: input.id },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
          approvedBy: ctx.session.user.id,
        },
      });

      return {
        ok: true,
        _audit: {
          action: "comment.approve",
          entityType: "BlogComment",
          entityId: input.id,
          before: { status: before.status },
          after: { status: after.status, approvedBy: after.approvedBy },
        },
      };
    }),

  reject: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.blogComment.findUnique({ where: { id: input.id } });
      if (!before) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.blogComment.update({
        where: { id: input.id },
        data: { status: "REJECTED" },
      });

      return {
        ok: true,
        _audit: {
          action: "comment.reject",
          entityType: "BlogComment",
          entityId: input.id,
          before: { status: before.status },
          after: { status: "REJECTED" },
        },
      };
    }),

  markSpam: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.blogComment.findUnique({ where: { id: input.id } });
      if (!before) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.blogComment.update({
        where: { id: input.id },
        data: { status: "SPAM" },
      });

      return {
        ok: true,
        _audit: {
          action: "comment.markSpam",
          entityType: "BlogComment",
          entityId: input.id,
          before: { status: before.status },
          after: { status: "SPAM" },
        },
      };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const before = await ctx.db.blogComment.findUnique({ where: { id: input.id } });
      if (!before) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.blogComment.delete({ where: { id: input.id } });

      return {
        ok: true,
        _audit: {
          action: "comment.delete",
          entityType: "BlogComment",
          entityId: input.id,
          before,
        },
      };
    }),

  // Admin: count by status — for nav badge.
  pendingCount: adminProcedure.query(({ ctx }) =>
    ctx.db.blogComment.count({ where: { status: "PENDING" } })
  ),
});
