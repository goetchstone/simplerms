// server/trpc/root.ts
import { createTRPCRouter } from "@/server/trpc/trpc";
import { auditRouter } from "@/server/trpc/routers/audit";
import { catalogRouter } from "@/server/trpc/routers/catalog";
import { crmRouter } from "@/server/trpc/routers/crm";
import { taxRouter } from "@/server/trpc/routers/tax";
import { invoicesRouter } from "@/server/trpc/routers/invoices";

export const appRouter = createTRPCRouter({
  audit: auditRouter,
  catalog: catalogRouter,
  crm: crmRouter,
  tax: taxRouter,
  invoices: invoicesRouter,
});

export type AppRouter = typeof appRouter;
