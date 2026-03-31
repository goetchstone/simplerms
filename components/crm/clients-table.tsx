// components/crm/clients-table.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
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
import { Plus } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type ClientListOutput = RouterOutputs["crm"]["listClients"];

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const emptyForm: FormState = { name: "", email: "", phone: "", company: "", notes: "" };

export function ClientsTable({ initialData }: { initialData: ClientListOutput }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");

  const utils = trpc.useUtils();

  const { data } = trpc.crm.listClients.useQuery(
    { search: search || undefined, page: 1, limit: 50 },
    { initialData, placeholderData: (prev) => prev }
  );

  const create = trpc.crm.createClient.useMutation({
    onSuccess: (client) => {
      utils.crm.listClients.invalidate();
      setOpen(false);
      setForm(emptyForm);
      router.push(`/dashboard/crm/clients/${client.id}`);
    },
  });

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      notes: form.notes || null,
    });
  }

  const items = data?.items ?? initialData.items;

  return (
    <>
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button size="sm" className="ml-auto" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> New client
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Invoices</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  {search ? "No clients match your search." : "No clients yet."}
                </TableCell>
              </TableRow>
            )}
            {items.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/crm/clients/${client.id}`)}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-muted-foreground">{client.company ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{client.email ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{client.phone ?? "—"}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {client._count.invoices}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setForm(emptyForm); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" required value={form.name} onChange={field("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={field("company")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={field("email")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={field("phone")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={2} value={form.notes} onChange={field("notes")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
