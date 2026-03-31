// server/trpc/trpc.ts
import "server-only";

import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import superjson from "superjson";
import { ZodError } from "zod";

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth();
  return { db, session, headers: opts.headers };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Any unauthenticated caller — public booking, ticket intake, invoice view.
export const publicProcedure = t.procedure;

// Writes an AuditLog row after every mutation that carries audit metadata.
// Routers opt-in by returning { _audit: { action, entityType, entityId, before, after } }.
const withAudit = t.middleware(async ({ ctx, next, path }) => {
  const result = await next();
  if (!result.ok) return result;

  const data = result.data as
    | { _audit?: { action: string; entityType?: string; entityId?: string; before?: unknown; after?: unknown } }
    | undefined;

  if (data?._audit) {
    const { action, entityType, entityId, before, after } = data._audit;
    const ip =
      ctx.headers.get("x-forwarded-for") ??
      ctx.headers.get("x-real-ip") ??
      undefined;

    await ctx.db.auditLog.create({
      data: {
        userId: ctx.session?.user?.id ?? null,
        action: action ?? path,
        entityType: entityType ?? null,
        entityId: entityId ?? null,
        before: (before as object) ?? undefined,
        after: (after as object) ?? undefined,
        ipAddress: ip,
        userAgent: ctx.headers.get("user-agent") ?? null,
      },
    });
  }

  return result;
});

// Any signed-in staff member (ADMIN, STAFF, READONLY).
export const protectedProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, session: ctx.session } });
  })
  .use(withAudit);

// Admins only — user management, settings, audit log, destructive actions.
export const adminProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next({ ctx: { ...ctx, session: ctx.session } });
  })
  .use(withAudit);
