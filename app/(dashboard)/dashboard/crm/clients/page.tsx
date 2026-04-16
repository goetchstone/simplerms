// app/(dashboard)/dashboard/crm/clients/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { ClientsTable } from "@/components/crm/clients-table";

export default async function ClientsPage() {
  const caller = await createCachedCaller();
  const result = await caller.crm.listClients({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All client accounts and contacts.
        </p>
      </div>
      <ClientsTable initialData={result} />
    </div>
  );
}
