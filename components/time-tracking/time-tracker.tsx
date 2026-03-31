// components/time-tracking/time-tracker.tsx
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
import { Plus, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/trpc/client";

type TimeListOutput = RouterOutputs["time"]["list"];
type Client = RouterOutputs["crm"]["listClients"]["items"][number];

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
}

interface EntryForm {
  clientId: string;
  description: string;
  hours: string;
  minutes: string;
  date: string;
  isBillable: boolean;
}

const emptyForm = (): EntryForm => ({
  clientId: "",
  description: "",
  hours: "",
  minutes: "",
  date: new Date().toISOString().slice(0, 10),
  isBillable: true,
});

interface Props {
  initialData: TimeListOutput;
  clients: Client[];
}

export function TimeTracker({ initialData, clients }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EntryForm>(emptyForm());
  const [billableFilter, setBillableFilter] = useState<"all" | "billable" | "non-billable">("all");

  const utils = trpc.useUtils();

  const { data } = trpc.time.list.useQuery(
    {
      page: 1,
      limit: 50,
      billableOnly: billableFilter === "billable",
    },
    {
      initialData: billableFilter === "all" ? initialData : undefined,
      placeholderData: (prev) => prev,
    }
  );

  const create = trpc.time.create.useMutation({
    onSuccess: () => {
      utils.time.list.invalidate();
      setOpen(false);
      setForm(emptyForm());
    },
  });

  const del = trpc.time.delete.useMutation({
    onSuccess: () => utils.time.list.invalidate(),
  });

  function field(key: keyof EntryForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const totalMinutes = (parseInt(form.hours || "0", 10) * 60) + parseInt(form.minutes || "0", 10);
    if (totalMinutes < 1) return;
    create.mutate({
      clientId: form.clientId || null,
      description: form.description,
      minutes: totalMinutes,
      date: new Date(form.date),
      isBillable: form.isBillable,
    });
  }

  const items = data?.items ?? initialData.items;
  const totalMinutes = items.reduce((s, e) => s + e.minutes, 0);
  const billableMinutes = items.filter((e) => e.isBillable).reduce((s, e) => s + e.minutes, 0);

  return (
    <>
      {/* Summary bar */}
      <div className="flex items-center gap-6 rounded-lg border bg-zinc-50 px-5 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Total</span>
          <span className="font-mono font-semibold">{formatMinutes(totalMinutes)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Billable </span>
          <span className="font-mono font-semibold text-green-700">{formatMinutes(billableMinutes)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Non-billable </span>
          <span className="font-mono font-semibold">{formatMinutes(totalMinutes - billableMinutes)}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {(["all", "billable", "non-billable"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setBillableFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                billableFilter === f
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {f === "all" ? "All" : f === "billable" ? "Billable" : "Non-billable"}
            </button>
          ))}
        </div>

        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Log time
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No time entries yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(entry.date)}
                </TableCell>
                <TableCell className="max-w-xs font-medium">{entry.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.client?.name ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.user.name}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-medium">
                  {formatMinutes(entry.minutes)}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.isBillable
                        ? "bg-green-50 text-green-700"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {entry.isBillable ? "Billable" : "Non-billable"}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      if (confirm("Delete this time entry?")) del.mutate(entry.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setForm(emptyForm()); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log time</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description *</Label>
              <Input
                id="desc"
                required
                value={form.description}
                onChange={field("description")}
                placeholder="What did you work on?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={form.hours}
                  onChange={field("hours")}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mins">Minutes</Label>
                <Input
                  id="mins"
                  type="number"
                  min="0"
                  max="59"
                  value={form.minutes}
                  onChange={field("minutes")}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={field("date")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client">Client</Label>
                <select
                  id="client"
                  value={form.clientId}
                  onChange={field("clientId")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={form.isBillable}
                onChange={(e) => setForm((f) => ({ ...f, isBillable: e.target.checked }))}
                className="h-4 w-4"
              />
              Billable
            </label>

            {create.error && <p className="text-sm text-destructive">{create.error.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={create.isPending}>
                {create.isPending ? "Saving…" : "Save entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
