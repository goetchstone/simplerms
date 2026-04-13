// components/invoices/invoice-detail.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronLeft, Copy, ExternalLink, Pencil, Send, Ban } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type InvoiceData = RouterOutputs["invoices"]["byId"];

export function InvoiceDetail({ initialData }: { initialData: InvoiceData }) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: invoice } = trpc.invoices.byId.useQuery(initialData.id, { initialData });
  const inv = invoice ?? initialData;

  const generateLink = trpc.invoices.generatePaymentLink.useMutation({
    onSuccess: () => utils.invoices.byId.invalidate(inv.id),
  });

  const send = trpc.invoices.send.useMutation({
    onSuccess: () => utils.invoices.byId.invalidate(inv.id),
  });

  const voidInvoice = trpc.invoices.void.useMutation({
    onSuccess: () => {
      utils.invoices.byId.invalidate(inv.id);
      utils.invoices.list.invalidate();
    },
  });

  const duplicate = trpc.invoices.duplicate.useMutation({
    onSuccess: (newInv) => {
      utils.invoices.list.invalidate();
      router.push(`/dashboard/invoices/${newInv.id}`);
    },
  });

  const canVoid = !["PAID", "VOID"].includes(inv.status);
  const canSend = !["VOID"].includes(inv.status) && !!inv.client.email;

  const subtotal = inv.lines.reduce((sum, l) => sum + Number(l.lineTotal), 0);
  const taxTotal = inv.lines.reduce(
    (sum, l) => sum + l.taxes.reduce((ts, t) => ts + Number(t.taxAmount), 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/invoices"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold">{inv.invoiceNumber}</h1>
            <StatusBadge status={inv.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {inv.client.name}
            {inv.client.company ? ` · ${inv.client.company}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {inv.status === "DRAFT" && (
            <Link
              href={`/dashboard/invoices/${inv.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          )}

          <Button
            size="sm"
            variant="outline"
            disabled={duplicate.isPending}
            onClick={() => duplicate.mutate(inv.id)}
          >
            <Copy className="mr-1.5 h-4 w-4" />
            {duplicate.isPending ? "Duplicating…" : "Duplicate"}
          </Button>

          {inv.stripePaymentLink && (
            <a
              href={inv.stripePaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" /> Payment link
            </a>
          )}

          {!inv.stripePaymentLink && canVoid && (
            <Button
              size="sm"
              variant="outline"
              disabled={generateLink.isPending}
              onClick={() => generateLink.mutate(inv.id)}
            >
              {generateLink.isPending ? "Creating…" : "Create payment link"}
            </Button>
          )}

          {canSend && (
            <Button
              size="sm"
              variant="outline"
              disabled={send.isPending}
              onClick={() => send.mutate(inv.id)}
            >
              <Send className="mr-1.5 h-4 w-4" />
              {send.isPending ? "Sending…" : "Send to client"}
            </Button>
          )}

          {canVoid && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              disabled={voidInvoice.isPending}
              onClick={() => {
                if (confirm("Void this invoice? This cannot be undone.")) {
                  voidInvoice.mutate(inv.id);
                }
              }}
            >
              <Ban className="mr-1.5 h-4 w-4" />
              {voidInvoice.isPending ? "Voiding…" : "Void"}
            </Button>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="flex gap-8 text-sm">
        <div>
          <p className="text-muted-foreground">Issue date</p>
          <p className="font-medium">{formatDate(inv.issueDate)}</p>
        </div>
        {inv.dueDate && (
          <div>
            <p className="text-muted-foreground">Due date</p>
            <p className="font-medium">{formatDate(inv.dueDate)}</p>
          </div>
        )}
        {inv.paidAt && (
          <div>
            <p className="text-muted-foreground">Paid</p>
            <p className="font-medium">{formatDate(inv.paidAt)}</p>
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Unit price</th>
              <th className="px-4 py-3 text-right">Tax</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {inv.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{line.description}</p>
                  {line.taxes.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {line.taxes.map((t) => t.taxRate.name).join(", ")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono">{Number(line.quantity)}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatCurrency(Number(line.unitPrice), inv.currency)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                  {line.taxes.length > 0
                    ? formatCurrency(
                        line.taxes.reduce((s, t) => s + Number(t.taxAmount), 0),
                        inv.currency
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium">
                  {formatCurrency(Number(line.lineTotal), inv.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-zinc-50 text-sm">
            <tr>
              <td colSpan={4} className="px-4 py-3 text-right text-muted-foreground">Subtotal</td>
              <td className="px-4 py-3 text-right font-mono">{formatCurrency(subtotal, inv.currency)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="px-4 py-3 text-right text-muted-foreground">Tax</td>
              <td className="px-4 py-3 text-right font-mono">{formatCurrency(taxTotal, inv.currency)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={4} className="px-4 py-3 text-right">Total</td>
              <td className="px-4 py-3 text-right font-mono text-base">
                {formatCurrency(Number(inv.total), inv.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payments */}
      {inv.payments.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold">Payments received</h2>
          <div className="rounded-lg border divide-y text-sm">
            {inv.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{p.method}</p>
                  {p.reference && <p className="text-xs text-muted-foreground">{p.reference}</p>}
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">{formatCurrency(Number(p.amount), inv.currency)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(p.paidAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {inv.notes && (
        <div className="rounded-lg border bg-zinc-50 p-4 text-sm">
          <p className="mb-1 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
          <p className="leading-relaxed">{inv.notes}</p>
        </div>
      )}
    </div>
  );
}
