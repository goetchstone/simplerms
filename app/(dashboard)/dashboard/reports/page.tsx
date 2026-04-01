// app/(dashboard)/dashboard/reports/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";

export default async function ReportsPage() {
  const caller = await createCachedCaller();

  const [revenue, aging, topClients, ticketStats] = await Promise.all([
    caller.reports.revenueByMonth({ months: 12 }),
    caller.reports.invoiceAging(),
    caller.reports.topClients({ limit: 10 }),
    caller.reports.ticketStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue trends, invoice aging, and support metrics.
        </p>
      </div>
      <ReportsDashboard
        revenue={revenue}
        aging={aging}
        topClients={topClients}
        ticketStats={ticketStats}
      />
    </div>
  );
}
