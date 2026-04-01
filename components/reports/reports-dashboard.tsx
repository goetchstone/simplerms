// components/reports/reports-dashboard.tsx
"use client";

import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type RevenueRow = RouterOutputs["reports"]["revenueByMonth"][number];
type AgingRow = RouterOutputs["reports"]["invoiceAging"][number];
type TopClient = RouterOutputs["reports"]["topClients"][number];
type TicketStats = RouterOutputs["reports"]["ticketStats"];

interface Props {
  revenue: RevenueRow[];
  aging: AgingRow[];
  topClients: TopClient[];
  ticketStats: TicketStats;
}

const BUCKETS = ["current", "1-30", "31-60", "61-90", "90+"] as const;
const bucketLabel: Record<string, string> = {
  current: "Current",
  "1-30": "1–30 days",
  "31-60": "31–60 days",
  "61-90": "61–90 days",
  "90+": "90+ days",
};
const bucketColor: Record<string, string> = {
  current: "text-green-600",
  "1-30": "text-yellow-600",
  "31-60": "text-orange-600",
  "61-90": "text-red-500",
  "90+": "text-red-700 font-semibold",
};

export function ReportsDashboard({ revenue, aging, topClients, ticketStats }: Props) {
  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);

  const agingBuckets = BUCKETS.map((b) => ({
    bucket: b,
    total: aging.filter((i) => i.bucket === b).reduce((s, i) => s + i.outstanding, 0),
    count: aging.filter((i) => i.bucket === b).length,
  }));

  const totalOutstanding = aging.reduce((s, i) => s + i.outstanding, 0);

  return (
    <div className="space-y-6">
      {/* Revenue chart */}
      <div className="rounded-xl border p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-semibold">Revenue (last 12 months)</h2>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCurrency(totalRevenue, "CAD")}
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>

        <div className="flex items-end gap-1.5 h-32">
          {revenue.map((r) => {
            const pct = maxRevenue > 0 ? (r.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={r.month} className="group relative flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-zinc-900 transition-all"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
                <span className="text-[9px] text-muted-foreground rotate-45 origin-left">
                  {r.month.slice(5)}
                </span>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                  {formatCurrency(r.revenue, "CAD")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoice aging */}
        <div className="rounded-xl border p-6">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="font-semibold">Invoice aging</h2>
            <AlertTriangle className={`h-5 w-5 ${totalOutstanding > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
          </div>
          <p className="mb-4 text-2xl font-semibold tabular-nums">
            {formatCurrency(totalOutstanding, "CAD")}
            <span className="ml-2 text-sm font-normal text-muted-foreground">outstanding</span>
          </p>
          <div className="space-y-2">
            {agingBuckets.map((b) => (
              <div key={b.bucket} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{bucketLabel[b.bucket]}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{b.count} invoice{b.count !== 1 ? "s" : ""}</span>
                  <span className={`font-mono font-medium tabular-nums ${bucketColor[b.bucket]}`}>
                    {formatCurrency(b.total, "CAD")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 font-semibold">Top clients by revenue</h2>
          {topClients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No paid invoices yet.</p>
          ) : (
            <div className="space-y-3">
              {topClients.map((tc, i) => {
                const pct = topClients[0].revenue > 0 ? (tc.revenue / topClients[0].revenue) * 100 : 0;
                return (
                  <div key={tc.client.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{tc.client.name}</span>
                      <span className="font-mono tabular-nums">{formatCurrency(tc.revenue, "CAD")}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-900"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket stats */}
        <div className="rounded-xl border p-6">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="font-semibold">Support overview</h2>
            {ticketStats.avgResolutionHours !== null && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Avg {ticketStats.avgResolutionHours}h to resolve
              </div>
            )}
          </div>
          <p className="mb-4 text-2xl font-semibold tabular-nums">
            {ticketStats.totalOpen}
            <span className="ml-2 text-sm font-normal text-muted-foreground">open tickets</span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">By status</p>
              <div className="space-y-1.5">
                {ticketStats.byStatus.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-sm">
                    <StatusBadge status={s.status} />
                    <span className="font-mono font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">By priority</p>
              <div className="space-y-1.5">
                {ticketStats.byPriority.map((p) => (
                  <div key={p.priority} className="flex items-center justify-between text-sm">
                    <StatusBadge status={p.priority} />
                    <span className="font-mono font-medium">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
