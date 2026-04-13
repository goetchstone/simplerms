// app/(dashboard)/dashboard/reports/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";
import { Download } from "lucide-react";

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revenue trends, invoice aging, and support metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/reports/export?type=invoices"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Invoices
          </a>
          <a
            href="/api/reports/export?type=clients"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Clients
          </a>
          <a
            href="/api/reports/export?type=time"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Time
          </a>
        </div>
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
