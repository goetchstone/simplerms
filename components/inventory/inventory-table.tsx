// components/inventory/inventory-table.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type InventoryListOutput = RouterOutputs["inventory"]["list"];

interface AdjustForm {
  delta: string;
  reason: string;
  reference: string;
}

interface Props {
  initialData: InventoryListOutput;
}

export function InventoryTable({ initialData }: Props) {
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [form, setForm] = useState<AdjustForm>({ delta: "", reason: "", reference: "" });
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const utils = trpc.useUtils();

  const { data } = trpc.inventory.list.useQuery(
    { page: 1, limit: 100, lowStock: lowStockOnly },
    { initialData: lowStockOnly ? undefined : initialData, placeholderData: (prev) => prev }
  );

  const adjust = trpc.inventory.adjust.useMutation({
    onSuccess: () => {
      utils.inventory.list.invalidate();
      setAdjusting(null);
      setForm({ delta: "", reason: "", reference: "" });
    },
  });

  function submitAdjust(e: React.FormEvent) {
    e.preventDefault();
    if (!adjusting) return;
    adjust.mutate({
      inventoryItemId: adjusting,
      delta: parseInt(form.delta, 10),
      reason: form.reason,
      reference: form.reference || null,
    });
  }

  const items = data?.items ?? initialData.items;
  const lowStockCount = initialData.items.filter(
    (i) => i.reorderPoint !== null && i.qtyOnHand <= i.reorderPoint
  ).length;

  const adjustingItem = adjusting ? items.find((i) => i.id === adjusting) : null;

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLowStockOnly((v) => !v)}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            lowStockOnly
              ? "bg-amber-100 text-amber-800"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Low stock ({lowStockCount})
        </button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">On hand</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Reorder at</TableHead>
              <TableHead>Location</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  {lowStockOnly ? "No low-stock items." : "No inventory items yet."}
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => {
              const available = item.qtyOnHand - item.qtyReserved;
              const isLow = item.reorderPoint !== null && item.qtyOnHand <= item.reorderPoint;
              return (
                <TableRow key={item.id} className={isLow ? "bg-amber-50/50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {isLow && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                      {item.catalogItem.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.catalogItem.sku ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">{item.qtyOnHand}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{item.qtyReserved}</TableCell>
                  <TableCell className={`text-right font-mono font-medium ${available <= 0 ? "text-red-600" : ""}`}>
                    {available}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {item.reorderPoint ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.location ?? "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAdjusting(item.id)}
                    >
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!adjusting} onOpenChange={(v) => { if (!v) setAdjusting(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Adjust stock — {adjustingItem?.catalogItem.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitAdjust} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="delta">Quantity change *</Label>
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border border-input">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, delta: String(Math.min(0, parseInt(f.delta || "0", 10) - 1)) }))}
                    className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <Input
                    id="delta"
                    type="number"
                    required
                    value={form.delta}
                    onChange={(e) => setForm((f) => ({ ...f, delta: e.target.value }))}
                    className="w-20 rounded-none border-0 text-center"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, delta: String(parseInt(f.delta || "0", 10) + 1) }))}
                    className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {parseInt(form.delta || "0", 10) > 0 ? "Receiving" : parseInt(form.delta || "0", 10) < 0 ? "Removing" : "No change"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                required
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Received shipment, damaged goods, etc."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ref">Reference (PO, invoice, etc.)</Label>
              <Input
                id="ref"
                value={form.reference}
                onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                placeholder="Optional"
              />
            </div>

            {adjust.error && <p className="text-sm text-destructive">{adjust.error.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAdjusting(null)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={adjust.isPending || !form.delta}>
                {adjust.isPending ? "Saving…" : "Save adjustment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
