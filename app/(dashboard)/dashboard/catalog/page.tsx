// app/(dashboard)/dashboard/catalog/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { CatalogTable } from "@/components/catalog/catalog-table";

export default async function CatalogPage() {
  const caller = await createCachedCaller();
  const items = await caller.catalog.list({ includeInactive: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Services and products you bill to clients.
        </p>
      </div>
      <CatalogTable items={items} />
    </div>
  );
}
