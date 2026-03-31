// components/catalog/catalog-table.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type CatalogListItem = RouterOutputs["catalog"]["list"][number];

const ITEM_TYPES = ["SERVICE", "PRODUCT", "DIGITAL"] as const;
type ItemType = (typeof ITEM_TYPES)[number];

interface CatalogTableProps {
  items: CatalogListItem[];
}

interface FormState {
  name: string;
  description: string;
  sku: string;
  type: ItemType;
  unitPrice: string;
  unit: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  sku: "",
  type: "SERVICE",
  unitPrice: "",
  unit: "",
};

export function CatalogTable({ items: initialItems }: CatalogTableProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogListItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const utils = trpc.useUtils();

  const { data } = trpc.catalog.list.useQuery(
    { includeInactive: false },
    { initialData: initialItems }
  );

  const create = trpc.catalog.create.useMutation({
    onSuccess: () => { utils.catalog.list.invalidate(); close(); },
  });

  const update = trpc.catalog.update.useMutation({
    onSuccess: () => { utils.catalog.list.invalidate(); close(); },
  });

  const archive = trpc.catalog.archive.useMutation({
    onSuccess: () => utils.catalog.list.invalidate(),
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: CatalogListItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      sku: item.sku ?? "",
      type: item.type as ItemType,
      unitPrice: String(Number(item.unitPrice)),
      unit: item.unit ?? "",
    });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      sku: form.sku || null,
      type: form.type,
      unitPrice: parseFloat(form.unitPrice),
      unit: form.unit || null,
      isActive: true,
    };
    if (editing) {
      update.mutate({ id: editing.id, data: payload });
    } else {
      create.mutate(payload);
    }
  }

  const items = data ?? initialItems;
  const pending = create.isPending || update.isPending;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> New item
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No items yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                  {item.unit && (
                    <span className="ml-1.5 text-xs text-muted-foreground">/ {item.unit}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {item.type.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.sku ?? "—"}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(Number(item.unitPrice))}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "New catalog item"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={field("name")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={field("type")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="unit">Unit label</Label>
                <Input id="unit" placeholder="hr, each…" value={form.unit} onChange={field("unit")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unitPrice">Price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.unitPrice}
                  onChange={field("unitPrice")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={field("sku")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={field("description")}
              />
            </div>

            <div className="flex justify-end gap-2">
              {editing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mr-auto text-destructive hover:text-destructive"
                  onClick={() => { archive.mutate(editing.id); close(); }}
                >
                  Archive
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Saving…" : editing ? "Save" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
