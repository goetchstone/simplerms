// app/(dashboard)/dashboard/inventory/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { InventoryTable } from "@/components/inventory/inventory-table";

export default async function InventoryPage() {
  const caller = await createCachedCaller();
  const result = await caller.inventory.list({ page: 1, limit: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stock levels, adjustments, and reorder alerts.
        </p>
      </div>
      <InventoryTable initialData={result} />
    </div>
  );
}
