// app/(dashboard)/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import {
  Users,
  FileText,
  Ticket,
  CalendarDays,
  Clock,
  AlertTriangle,
} from "lucide-react";

async function getStats() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [
    clientCount,
    openInvoiceCount,
    overdueInvoices,
    openTicketCount,
    todayAppointments,
    recentInvoices,
    recentTickets,
    lowStockCount,
    unbilledMinutes,
  ] = await Promise.all([
    db.client.count({ where: { isActive: true } }),
    db.invoice.count({ where: { status: { in: ["DRAFT", "SENT", "VIEWED", "PARTIAL"] } } }),
    db.invoice.findMany({
      where: { status: { in: ["SENT", "VIEWED", "PARTIAL"] }, dueDate: { lt: today } },
      select: { invoiceNumber: true, total: true, currency: true, client: { select: { name: true } }, dueDate: true },
      orderBy: { dueDate: "asc" },
      take: 3,
    }),
    db.ticket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.appointment.findMany({
      where: {
        startsAt: { gte: new Date(today.setHours(0, 0, 0, 0)), lte: new Date(today.setHours(23, 59, 59, 999)) },
        status: { notIn: ["CANCELLED"] },
      },
      include: { service: { select: { name: true } } },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    db.invoice.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, invoiceNumber: true, status: true, total: true, currency: true, client: { select: { name: true } }, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.ticket.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      select: { id: true, ticketNumber: true, subject: true, priority: true, status: true, createdAt: true },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    db.inventoryItem.count({
      where: { reorderPoint: { not: null }, qtyOnHand: { lte: db.inventoryItem.fields.reorderPoint } },
    }).catch(() => 0),
    db.timeEntry.aggregate({
      where: { isBillable: true, invoiceId: null },
      _sum: { minutes: true },
    }),
  ]);

  return {
    clientCount,
    openInvoiceCount,
    overdueInvoices,
    openTicketCount,
    todayAppointments,
    recentInvoices,
    recentTickets,
    lowStockCount,
    unbilledMinutes: unbilledMinutes._sum.minutes ?? 0,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  const unbilledHours = Math.floor(stats.unbilledMinutes / 60);
  const unbilledMins = stats.unbilledMinutes % 60;
  const unbilledLabel = unbilledHours > 0
    ? `${unbilledHours}h ${unbilledMins > 0 ? `${unbilledMins}m` : ""}`
    : `${unbilledMins}m`;

  const kpis = [
    { label: "Active clients", value: stats.clientCount, href: "/dashboard/crm/clients", icon: Users, color: "text-blue-600" },
    { label: "Open invoices", value: stats.openInvoiceCount, href: "/dashboard/invoices", icon: FileText, color: "text-amber-600" },
    { label: "Open tickets", value: stats.openTicketCount, href: "/dashboard/tickets", icon: Ticket, color: "text-red-600" },
    { label: "Today's appointments", value: stats.todayAppointments.length, href: "/dashboard/scheduling", icon: CalendarDays, color: "text-green-600" },
    { label: "Unbilled hours", value: unbilledLabel, href: "/dashboard/time-tracking", icon: Clock, color: "text-purple-600" },
    ...(stats.lowStockCount > 0 ? [{ label: "Low stock alerts", value: stats.lowStockCount, href: "/dashboard/inventory", icon: AlertTriangle, color: "text-orange-600" }] : []),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="flex flex-col rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</span>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <span className="text-2xl font-semibold tabular-nums">{kpi.value}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overdue invoices */}
        {stats.overdueInvoices.length > 0 && (
          <div className="rounded-xl border">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-sm font-semibold">Overdue invoices</h2>
              <Link href="/dashboard/invoices" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="divide-y">
              {stats.overdueInvoices.map((inv) => (
                <li key={inv.invoiceNumber} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-mono font-medium">{inv.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{inv.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium text-red-600">
                      {formatCurrency(Number(inv.total), inv.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent invoices */}
        <div className="rounded-xl border">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-sm font-semibold">Recent invoices</h2>
            <Link href="/dashboard/invoices" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          {stats.recentInvoices.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <ul className="divide-y">
              {stats.recentInvoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <Link href={`/dashboard/invoices/${inv.id}`} className="font-mono font-medium hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">{inv.client.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={inv.status} />
                    <span className="font-mono font-medium">
                      {formatCurrency(Number(inv.total), inv.currency)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Open tickets */}
        {stats.recentTickets.length > 0 && (
          <div className="rounded-xl border">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-sm font-semibold">Open tickets</h2>
              <Link href="/dashboard/tickets" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="divide-y">
              {stats.recentTickets.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <Link href={`/dashboard/tickets/${t.id}`} className="font-mono font-medium hover:underline">
                      {t.ticketNumber}
                    </Link>
                    <p className="max-w-xs truncate text-xs text-muted-foreground">{t.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Today's appointments */}
        {stats.todayAppointments.length > 0 && (
          <div className="rounded-xl border">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-sm font-semibold">Today's appointments</h2>
              <Link href="/dashboard/scheduling" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="divide-y">
              {stats.todayAppointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium">{a.bookerName}</p>
                    <p className="text-xs text-muted-foreground">{a.service.name}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(a.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
