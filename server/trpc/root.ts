// server/trpc/root.ts
import { createTRPCRouter } from "@/server/trpc/trpc";
import { auditRouter } from "@/server/trpc/routers/audit";

// Routers are added here as each module is built.
export const appRouter = createTRPCRouter({
  audit: auditRouter,
});

export type AppRouter = typeof appRouter;
