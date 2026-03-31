// components/invoices/invoice-create-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type Client = RouterOutputs["crm"]["listClients"]["items"][number];
type TaxRate = RouterOutputs["tax"]["list"][number];

interface LineItem {
  description: string;
  quantity: string;
  unitPrice: string;
  taxRateIds: string[];
}

const emptyLine = (): LineItem => ({
  description: "",
  quantity: "1",
  unitPrice: "",
  taxRateIds: [],
});

function computePreview(lines: LineItem[], rates: TaxRate[]) {
  const rateMap = new Map(rates.map((r) => [r.id, r]));
  let subtotal = 0;
  let taxTotal = 0;

  for (const l of lines) {
    const qty = parseFloat(l.quantity) || 0;
    const price = parseFloat(l.unitPrice) || 0;
    const lineTotal = qty * price;
    subtotal += lineTotal;

    const simpleTax = l.taxRateIds
      .map((id) => rateMap.get(id))
      .filter((r): r is TaxRate => !!r && !r.isCompound)
      .reduce((s, r) => s + lineTotal * Number(r.rate), 0);

    const compoundTax = l.taxRateIds
      .map((id) => rateMap.get(id))
      .filter((r): r is TaxRate => !!r && r.isCompound)
      .reduce((s, r) => s + (lineTotal + simpleTax) * Number(r.rate), 0);

    taxTotal += simpleTax + compoundTax;
  }

  return { subtotal, taxTotal, total: subtotal + taxTotal };
}

interface Props {
  clients: Client[];
  taxRates: TaxRate[];
  defaultClientId?: string;
}

export function InvoiceCreateForm({ clients, taxRates, defaultClientId }: Props) {
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [currency, setCurrency] = useState("CAD");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);

  const create = trpc.invoices.create.useMutation({
    onSuccess: (inv) => router.push(`/dashboard/invoices/${inv.id}`),
  });

  const preview = computePreview(lines, taxRates);

  function updateLine(i: number, patch: Partial<LineItem>) {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function toggleTax(lineIdx: number, taxId: string) {
    setLines((ls) =>
      ls.map((l, i) => {
        if (i !== lineIdx) return l;
        const has = l.taxRateIds.includes(taxId);
        return {
          ...l,
          taxRateIds: has ? l.taxRateIds.filter((id) => id !== taxId) : [...l.taxRateIds, taxId],
        };
      })
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      clientId,
      currency,
      issueDate,
      dueDate: dueDate || undefined,
      notes: notes || undefined,
      lines: lines.map((l) => ({
        description: l.description,
        quantity: parseFloat(l.quantity),
        unitPrice: parseFloat(l.unitPrice),
        taxRateIds: l.taxRateIds,
      })),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Header fields */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="client">Client *</Label>
          <select
            id="client"
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {["CAD", "USD", "EUR", "GBP"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="issue">Issue date</Label>
          <Input id="issue" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due">Due date</Label>
          <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      {/* Line items */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Line items</h2>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="rounded-lg border bg-zinc-50 p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <div className="space-y-1.5">
                  <Label htmlFor={`desc-${i}`}>Description *</Label>
                  <Input
                    id={`desc-${i}`}
                    required
                    value={line.description}
                    onChange={(e) => updateLine(i, { description: e.target.value })}
                    placeholder="Service or item description"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`qty-${i}`}>Qty *</Label>
                  <Input
                    id={`qty-${i}`}
                    type="number"
                    required
                    min="0.001"
                    step="any"
                    className="w-24"
                    value={line.quantity}
                    onChange={(e) => updateLine(i, { quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`price-${i}`}>Unit price *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`price-${i}`}
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-28"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(i, { unitPrice: e.target.value })}
                      placeholder="0.00"
                    />
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax checkboxes */}
              {taxRates.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {taxRates.map((rate) => (
                    <label key={rate.id} className="flex cursor-pointer items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={line.taxRateIds.includes(rate.id)}
                        onChange={() => toggleTax(i, rate.id)}
                        className="h-3.5 w-3.5"
                      />
                      {rate.name} ({(Number(rate.rate) * 100).toFixed(3).replace(/\.?0+$/, "")}%
                      {rate.isCompound ? " compound" : ""})
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setLines((ls) => [...ls, emptyLine()])}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add line
        </Button>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {/* Total preview */}
      <div className="rounded-lg border bg-zinc-50 p-4 text-sm">
        <div className="space-y-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(preview.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(preview.taxTotal, currency)}</span>
          </div>
          <div className="flex justify-between border-t pt-1.5 font-semibold">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(preview.total, currency)}</span>
          </div>
        </div>
      </div>

      {create.error && (
        <p className="text-sm text-destructive">{create.error.message}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Creating…" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
