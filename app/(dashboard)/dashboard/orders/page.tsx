// app/(dashboard)/dashboard/orders/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { OrdersTable } from "@/components/orders/orders-table";

export default async function OrdersPage() {
  const caller = await createCachedCaller();
  const [result, clients] = await Promise.all([
    caller.orders.list({ page: 1, limit: 50 }),
    caller.crm.listClients({ page: 1, limit: 200 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track client orders and link them to invoices.
        </p>
      </div>
      <OrdersTable initialData={result} clients={clients.items} />
    </div>
  );
}
