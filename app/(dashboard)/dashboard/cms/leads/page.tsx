// app/(dashboard)/dashboard/cms/leads/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { LeadsTable } from "@/components/cms/leads-table";

export default async function LeadsPage() {
  const caller = await createCachedCaller();
  const result = await caller.leads.list({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Email captures from lead magnets. Sorted newest first.
        </p>
      </div>
      <LeadsTable initialData={result} />
    </div>
  );
}
