// server/trpc/routers/cms.ts
import "server-only";

import { createTRPCRouter, adminProcedure, publicProcedure } from "@/server/trpc/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const blockSchema = z.array(
  z.object({
    type: z.enum(["heading", "paragraph", "image", "divider", "cta"]),
    content: z.string().optional(),
    level: z.number().int().min(1).max(6).optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
  })
);

const pageInputSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  content: blockSchema,
  metaTitle: z.string().max(255).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  sortOrder: z.number().int().default(0),
});

const postInputSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional().nullable(),
  content: blockSchema,
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const cmsRouter = createTRPCRouter({
  // ── Pages ─────────────────────────────────────────────────────────────────

  listPages: publicProcedure
    .input(z.object({ publishedOnly: z.boolean().default(true) }))
    .query(({ ctx, input }) =>
      ctx.db.cmsPage.findMany({
        where: input.publishedOnly ? { status: "PUBLISHED" } : {},
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, slug: true, status: true, sortOrder: true, updatedAt: true },
      })
    ),

  pageBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const page = await ctx.db.cmsPage.findUnique({ where: { slug: input } });
      if (!page || (page.status !== "PUBLISHED")) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return page;
    }),

  createPage: adminProcedure
    .input(pageInputSchema)
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.db.cmsPage.create({
        data: {
          ...input,
          content: input.content,
          publishedAt: input.status === "PUBLISHED" ? new Date() : null,
        },
      });
      return {
        ...page,
        _audit: { action: "cms.page.create", entityType: "CmsPage", entityId: page.id },
      };
    }),

  updatePage: adminProcedure
    .input(z.object({ id: z.string().cuid(), data: pageInputSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.db.cmsPage.update({
        where: { id: input.id },
        data: {
          ...input.data,
          ...(input.data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        },
      });
      return {
        ...page,
        _audit: { action: "cms.page.update", entityType: "CmsPage", entityId: page.id },
      };
    }),

  deletePage: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cmsPage.delete({ where: { id: input } });
      return {
        id: input,
        _audit: { action: "cms.page.delete", entityType: "CmsPage", entityId: input },
      };
    }),

  // ── Posts ─────────────────────────────────────────────────────────────────

  listPosts: publicProcedure
    .input(z.object({ publishedOnly: z.boolean().default(true) }))
    .query(({ ctx, input }) =>
      ctx.db.cmsPost.findMany({
        where: input.publishedOnly ? { status: "PUBLISHED" } : {},
        orderBy: { publishedAt: "desc" },
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, status: true, publishedAt: true },
      })
    ),

  postBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.cmsPost.findUnique({ where: { slug: input } });
      if (!post || post.status !== "PUBLISHED") throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  createPost: adminProcedure
    .input(postInputSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.cmsPost.create({
        data: {
          ...input,
          publishedAt: input.status === "PUBLISHED" ? new Date() : null,
        },
      });
      return {
        ...post,
        _audit: { action: "cms.post.create", entityType: "CmsPost", entityId: post.id },
      };
    }),

  updatePost: adminProcedure
    .input(z.object({ id: z.string().cuid(), data: postInputSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.cmsPost.update({
        where: { id: input.id },
        data: {
          ...input.data,
          ...(input.data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        },
      });
      return {
        ...post,
        _audit: { action: "cms.post.update", entityType: "CmsPost", entityId: post.id },
      };
    }),

  deletePost: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cmsPost.delete({ where: { id: input } });
      return {
        id: input,
        _audit: { action: "cms.post.delete", entityType: "CmsPost", entityId: input },
      };
    }),
});
