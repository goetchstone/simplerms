// app/(portal)/portal/[token]/invoices/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export default async function PortalInvoicesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await db.client.findUnique({
    where: { portalToken: token, isActive: true },
    select: { id: true, name: true },
  });
  if (!client) notFound();

  const invoices = await db.invoice.findMany({
    where: { clientId: client.id, status: { notIn: ["DRAFT", "VOID"] } },
    orderBy: { issueDate: "desc" },
    select: {
      invoiceNumber: true,
      status: true,
      issueDate: true,
      dueDate: true,
      total: true,
      paidAmount: true,
      currency: true,
      publicToken: true,
      stripePaymentLink: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href={`/portal/${token}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Invoices</h1>

        {invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices yet.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const remaining = Number(inv.total) - Number(inv.paidAmount);
              return (
                <Link
                  key={inv.publicToken}
                  href={`/portal/invoices/${inv.publicToken}`}
                  className="flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {inv.invoiceNumber}
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Issued {formatDate(inv.issueDate)}
                      {inv.dueDate ? ` · Due ${formatDate(inv.dueDate)}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-gray-900">
                      {formatCurrency(Number(inv.total), inv.currency)}
                    </p>
                    {remaining > 0 && inv.status !== "PAID" && inv.stripePaymentLink && (
                      <p className="text-xs text-gray-500">
                        {formatCurrency(remaining, inv.currency)} due
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
