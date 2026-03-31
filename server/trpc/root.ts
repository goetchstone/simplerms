// server/trpc/root.ts
import { createTRPCRouter } from "@/server/trpc/trpc";
import { auditRouter } from "@/server/trpc/routers/audit";
import { catalogRouter } from "@/server/trpc/routers/catalog";
import { crmRouter } from "@/server/trpc/routers/crm";
import { taxRouter } from "@/server/trpc/routers/tax";
import { invoicesRouter } from "@/server/trpc/routers/invoices";
import { ticketsRouter } from "@/server/trpc/routers/tickets";
import { schedulingRouter } from "@/server/trpc/routers/scheduling";
import { settingsRouter } from "@/server/trpc/routers/settings";
import { ordersRouter } from "@/server/trpc/routers/orders";
import { inventoryRouter } from "@/server/trpc/routers/inventory";
import { timeTrackingRouter } from "@/server/trpc/routers/timeTracking";

export const appRouter = createTRPCRouter({
  audit: auditRouter,
  catalog: catalogRouter,
  crm: crmRouter,
  tax: taxRouter,
  invoices: invoicesRouter,
  tickets: ticketsRouter,
  scheduling: schedulingRouter,
  settings: settingsRouter,
  orders: ordersRouter,
  inventory: inventoryRouter,
  time: timeTrackingRouter,
});

export type AppRouter = typeof appRouter;
