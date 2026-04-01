// app/(portal)/portal/invoices/[token]/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { notFound } from "next/navigation";

// Mark VIEWED on first open — server action keeps it lean.
async function markViewed(invoiceId: string) {
  "use server";
  await db.invoice.updateMany({
    where: { id: invoiceId, status: "SENT" },
    data: { status: "VIEWED" },
  });
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invoice = await db.invoice.findUnique({
    where: { publicToken: token },
    include: {
      client: { select: { name: true, company: true, email: true, address: true } },
      lines: {
        orderBy: { sortOrder: "asc" },
        include: { taxes: { include: { taxRate: true } } },
      },
      payments: { select: { amount: true, method: true, paidAt: true } },
    },
  });

  if (!invoice) notFound();

  if (invoice.status === "SENT") {
    await markViewed(invoice.id);
  }

  const companyName = (
    await db.setting.findUnique({ where: { key: "company_name" } })
  )?.value ?? "Akritos";

  const address =
    typeof invoice.client.address === "object" && invoice.client.address !== null
      ? (invoice.client.address as Record<string, string>)
      : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Card */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between border-b px-8 py-6">
            <div>
              <p className="text-sm font-semibold text-gray-900">{companyName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-gray-900">Invoice</p>
              <p className="mt-0.5 font-mono text-sm text-gray-500">{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Metadata */}
            <div className="mb-8 flex justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Bill to
                </p>
                <p className="font-medium text-gray-900">{invoice.client.name}</p>
                {invoice.client.company && (
                  <p className="text-sm text-gray-500">{invoice.client.company}</p>
                )}
                {invoice.client.email && (
                  <p className="text-sm text-gray-500">{invoice.client.email}</p>
                )}
                {address?.city && (
                  <p className="text-sm text-gray-500">
                    {[address.city, address.state, address.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="text-right space-y-1.5">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-gray-500">Issued</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
                {invoice.dueDate && (
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-sm text-gray-500">Due</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Line items */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 text-left">Description</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Unit price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3 text-gray-900">
                      {line.description}
                      {line.taxes.map((t) => (
                        <span key={t.id} className="ml-2 text-xs text-gray-400">
                          +{t.taxRate.name}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 text-right text-gray-600">{Number(line.quantity)}</td>
                    <td className="py-3 text-right text-gray-600">
                      {formatCurrency(Number(line.unitPrice), invoice.currency)}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      {formatCurrency(Number(line.lineTotal), invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-56 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">
                    {formatCurrency(Number(invoice.subtotal), invoice.currency)}
                  </span>
                </div>
                {Number(invoice.taxTotal) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">
                      {formatCurrency(Number(invoice.taxTotal), invoice.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(Number(invoice.total), invoice.currency)}</span>
                </div>
              </div>
            </div>

            {/* Pay button */}
            {invoice.stripePaymentLink && !["PAID", "VOID"].includes(invoice.status) && (
              <div className="mt-8 text-center">
                <a
                  href={invoice.stripePaymentLink}
                  className="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                >
                  Pay {formatCurrency(Number(invoice.total) - Number(invoice.paidAmount), invoice.currency)}
                </a>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 rounded-md bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Notes
                </p>
                <p className="mt-1 text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
