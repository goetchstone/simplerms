// app/(dashboard)/dashboard/time-tracking/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { TimeTracker } from "@/components/time-tracking/time-tracker";

export default async function TimeTrackingPage() {
  const caller = await createCachedCaller();
  const [result, clients] = await Promise.all([
    caller.time.list({ page: 1, limit: 50 }),
    caller.crm.listClients({ page: 1, limit: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Time tracking</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log billable and non-billable hours. Attach entries to invoices.
        </p>
      </div>
      <TimeTracker initialData={result} clients={clients.items} />
    </div>
  );
}
