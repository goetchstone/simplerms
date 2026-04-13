// components/crm/client-detail.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, Pencil, Plus, MessageSquare } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type ClientData = RouterOutputs["crm"]["clientById"];

interface EditForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

export function ClientDetail({ initialData }: { initialData: ClientData }) {
  const [noteContent, setNoteContent] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", email: "", phone: "", company: "", notes: "" });

  const { data: client } = trpc.crm.clientById.useQuery(initialData.id, { initialData });
  const utils = trpc.useUtils();

  const addNote = trpc.crm.addNote.useMutation({
    onSuccess: () => {
      utils.crm.clientById.invalidate(initialData.id);
      setNoteContent("");
    },
  });

  const updateClient = trpc.crm.updateClient.useMutation({
    onSuccess: () => {
      utils.crm.clientById.invalidate(initialData.id);
      utils.crm.listClients.invalidate();
      setEditOpen(false);
    },
  });

  function openEdit() {
    setEditForm({
      name: c.name,
      email: c.email ?? "",
      phone: c.phone ?? "",
      company: c.company ?? "",
      notes: c.notes ?? "",
    });
    setEditOpen(true);
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    updateClient.mutate({
      id: c.id,
      data: {
        name: editForm.name,
        email: editForm.email || null,
        phone: editForm.phone || null,
        company: editForm.company || null,
        notes: editForm.notes || null,
      },
    });
  }

  const c = client ?? initialData;

  function submitNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addNote.mutate({ clientId: c.id, content: noteContent });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/crm/clients"
            className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Clients
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
          {c.company && <p className="mt-0.5 text-sm text-muted-foreground">{c.company}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openEdit}>
            <Pencil className="mr-1.5 h-4 w-4" /> Edit
          </Button>
          <Link
            href={`/dashboard/invoices/new?clientId=${c.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> New invoice
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: info + contacts */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact info */}
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold">Contact information</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{c.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{c.phone ?? "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="mt-0.5">
                  <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} />
                </dd>
              </div>
            </dl>
          </div>

          {/* Contacts */}
          {c.contacts.length > 0 && (
            <div className="rounded-lg border p-5">
              <h2 className="mb-4 text-sm font-semibold">Contacts</h2>
              <div className="divide-y">
                {c.contacts.map((contact) => (
                  <div key={contact.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.role && (
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    )}
                    <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                      {contact.email && <span>{contact.email}</span>}
                      {contact.phone && <span>{contact.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity log */}
          {c.activityLog.length > 0 && (
            <div className="rounded-lg border p-5">
              <h2 className="mb-4 text-sm font-semibold">Activity</h2>
              <ol className="relative space-y-3 border-l border-zinc-200 pl-4">
                {c.activityLog.map((entry) => (
                  <li key={entry.id} className="text-sm">
                    <p className="font-medium leading-snug">{entry.summary}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right column: stats + notes */}
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              {[
                { label: "Invoices", value: c._count.invoices },
                { label: "Tickets", value: c._count.tickets },
                { label: "Orders", value: c._count.orders },
                { label: "Appointments", value: c._count.appointments },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-2xl font-semibold text-zinc-900">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4" /> Notes
            </h2>

            <form onSubmit={submitNote} className="mb-4 space-y-2">
              <Textarea
                rows={2}
                placeholder="Add a note…"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={addNote.isPending || !noteContent.trim()}>
                {addNote.isPending ? "Saving…" : "Add note"}
              </Button>
            </form>

            <div className="space-y-3">
              {c.notes_rel.length === 0 && (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
              {c.notes_rel.map((note) => (
                <div key={note.id} className="rounded-lg bg-zinc-50 p-3 text-sm">
                  <p className="leading-relaxed text-zinc-700">{note.content}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={(v) => { if (!v) setEditOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit client</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitEdit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editForm.company}
                onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                rows={2}
                value={editForm.notes}
                onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            {updateClient.error && <p className="text-sm text-destructive">{updateClient.error.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={updateClient.isPending}>
                {updateClient.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
