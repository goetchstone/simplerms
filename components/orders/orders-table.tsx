// components/orders/orders-table.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import { Plus, Trash2 } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type OrderListOutput = RouterOutputs["orders"]["list"];
type Client = RouterOutputs["crm"]["listClients"]["items"][number];

interface LineForm {
  description: string;
  quantity: string;
  unitPrice: string;
}

const emptyLine = (): LineForm => ({ description: "", quantity: "1", unitPrice: "" });

interface Props {
  initialData: OrderListOutput;
  clients: Client[];
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "IN_PROGRESS", "FULFILLED", "CANCELLED"] as const;

export function OrdersTable({ initialData, clients }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineForm[]>([emptyLine()]);

  const utils = trpc.useUtils();

  const { data } = trpc.orders.list.useQuery(
    { page: 1, limit: 50 },
    { initialData, placeholderData: (prev) => prev }
  );

  const create = trpc.orders.create.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
      setOpen(false);
      resetForm();
    },
  });

  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => utils.orders.list.invalidate(),
  });

  function resetForm() {
    setClientId("");
    setNotes("");
    setLines([emptyLine()]);
  }

  function updateLine(i: number, patch: Partial<LineForm>) {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      clientId,
      notes: notes || null,
      lines: lines.map((l) => ({
        description: l.description,
        quantity: parseInt(l.quantity, 10),
        unitPrice: parseFloat(l.unitPrice),
      })),
    });
  }

  const items = data?.items ?? initialData.items;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> New order
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead>Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <span className="font-medium">{order.client.name}</span>
                  {order.client.company && (
                    <span className="ml-1.5 text-xs text-muted-foreground">{order.client.company}</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {order._count.lines}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: order.id,
                        status: e.target.value as typeof STATUS_OPTIONS[number],
                      })
                    }
                    className="rounded border border-input bg-background px-2 py-1 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New order</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="client">Client *</Label>
              <select
                id="client"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label>Line items</Label>
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] items-end gap-2">
                  <div className="space-y-1">
                    <Input
                      required
                      placeholder="Description"
                      value={line.description}
                      onChange={(e) => updateLine(i, { description: e.target.value })}
                    />
                  </div>
                  <Input
                    required
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) => updateLine(i, { quantity: e.target.value })}
                  />
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(i, { unitPrice: e.target.value })}
                  />
                  <button
                    type="button"
                    disabled={lines.length === 1}
                    onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLines((ls) => [...ls, emptyLine()])}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add line
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
