// components/settings/tax-rates-panel.tsx
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
import { Plus } from "lucide-react";
import type { TaxRate } from "@prisma/client";

interface TaxRatesPanelProps {
  initialRates: TaxRate[];
}

interface FormState {
  name: string;
  ratePercent: string;
  isCompound: boolean;
}

const emptyForm: FormState = { name: "", ratePercent: "", isCompound: false };

export function TaxRatesPanel({ initialRates }: TaxRatesPanelProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const utils = trpc.useUtils();

  const { data: rates } = trpc.tax.list.useQuery(
    { includeInactive: false },
    { initialData: initialRates }
  );

  const create = trpc.tax.create.useMutation({
    onSuccess: () => { utils.tax.list.invalidate(); close(); },
  });

  const update = trpc.tax.update.useMutation({
    onSuccess: () => { utils.tax.list.invalidate(); close(); },
  });

  const deactivate = trpc.tax.deactivate.useMutation({
    onSuccess: () => { utils.tax.list.invalidate(); close(); },
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(rate: TaxRate) {
    setEditing(rate);
    setForm({
      name: rate.name,
      ratePercent: String(Number(rate.rate) * 100),
      isCompound: rate.isCompound,
    });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      ratePercent: parseFloat(form.ratePercent),
      isCompound: form.isCompound,
      isActive: true,
    };
    if (editing) {
      update.mutate({ id: editing.id, data: payload });
    } else {
      create.mutate(payload);
    }
  }

  const pending = create.isPending || update.isPending;
  const items = rates ?? initialRates;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add rate
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  No tax rates configured.
                </TableCell>
              </TableRow>
            )}
            {items.map((rate) => (
              <TableRow
                key={rate.id}
                className="cursor-pointer"
                onClick={() => openEdit(rate)}
              >
                <TableCell className="font-medium">{rate.name}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {(Number(rate.rate) * 100).toFixed(4).replace(/\.?0+$/, "")}%
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {rate.isCompound ? "Compound" : "Simple"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit tax rate" : "New tax rate"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="taxName">Name</Label>
              <Input
                id="taxName"
                placeholder="GST, HST, Sales Tax…"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ratePercent">Rate (%)</Label>
              <Input
                id="ratePercent"
                type="number"
                step="0.0001"
                min="0"
                max="100"
                required
                placeholder="8.25"
                value={form.ratePercent}
                onChange={(e) => setForm((f) => ({ ...f, ratePercent: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isCompound"
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                checked={form.isCompound}
                onChange={(e) => setForm((f) => ({ ...f, isCompound: e.target.checked }))}
              />
              <Label htmlFor="isCompound" className="font-normal">
                Compound — applies on top of other taxes
              </Label>
            </div>

            <div className="flex justify-end gap-2">
              {editing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mr-auto text-destructive hover:text-destructive"
                  onClick={() => { deactivate.mutate(editing.id); }}
                >
                  Deactivate
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={close}>Cancel</Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Saving…" : editing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
