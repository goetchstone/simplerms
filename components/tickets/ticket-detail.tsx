// components/tickets/ticket-detail.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, Lock, Send } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type TicketData = RouterOutputs["tickets"]["byId"];
type StaffUser = RouterOutputs["users"]["list"][number];

const STATUSES = ["OPEN", "IN_PROGRESS", "WAITING_ON_CLIENT", "RESOLVED", "CLOSED"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const priorityColor: Record<string, string> = {
  LOW: "bg-zinc-100 text-zinc-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-amber-50 text-amber-700",
  URGENT: "bg-red-50 text-red-700",
};

interface Props {
  initialData: TicketData;
  staffUsers: StaffUser[];
}

export function TicketDetail({ initialData, staffUsers }: Props) {
  const [replyBody, setReplyBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const { data: ticket } = trpc.tickets.byId.useQuery(initialData.id, { initialData });
  const utils = trpc.useUtils();
  const t = ticket ?? initialData;

  const reply = trpc.tickets.reply.useMutation({
    onSuccess: () => {
      utils.tickets.byId.invalidate(t.id);
      setReplyBody("");
      setIsInternal(false);
    },
  });

  const assign = trpc.tickets.assign.useMutation({
    onSuccess: () => {
      utils.tickets.byId.invalidate(t.id);
      utils.tickets.list.invalidate();
    },
  });

  const updateStatus = trpc.tickets.updateStatus.useMutation({
    onSuccess: () => {
      utils.tickets.byId.invalidate(t.id);
      utils.tickets.list.invalidate();
    },
  });

  function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    reply.mutate({ ticketId: t.id, body: replyBody, isInternal });
  }

  const isClosed = ["RESOLVED", "CLOSED"].includes(t.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/tickets"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Tickets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-lg font-semibold">{t.ticketNumber}</h1>
              <StatusBadge status={t.status} />
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor[t.priority] ?? ""}`}>
                {t.priority}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{t.subject}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              From {t.submitterName} ({t.submitterEmail})
              {t.client && (
                <>
                  {" · "}
                  <Link href={`/dashboard/crm/clients/${t.client.id}`} className="underline hover:text-foreground">
                    {t.client.name}
                  </Link>
                </>
              )}
              {" · "}
              {formatDate(t.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Messages */}
        <div className="space-y-4">
          {t.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-4 ${
                msg.isInternal
                  ? "border-amber-200 bg-amber-50"
                  : msg.senderId
                    ? "border-blue-200 bg-blue-50"
                    : "bg-zinc-50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {msg.senderName ?? "Unknown"}
                  </span>
                  {msg.isInternal && (
                    <span className="flex items-center gap-1 text-xs text-amber-700">
                      <Lock className="h-3 w-3" /> Internal
                    </span>
                  )}
                  {msg.senderId && !msg.isInternal && (
                    <span className="text-xs text-blue-600">Staff</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</p>
            </div>
          ))}

          {/* Reply form */}
          {!isClosed && (
            <form onSubmit={submitReply} className="space-y-3">
              <Textarea
                rows={4}
                placeholder={isInternal ? "Internal note (not visible to client)…" : "Reply to client…"}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Internal note
                </label>
                <Button type="submit" size="sm" disabled={reply.isPending || !replyBody.trim()}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {reply.isPending ? "Sending…" : isInternal ? "Add note" : "Send reply"}
                </Button>
              </div>
              {reply.error && <p className="text-sm text-destructive">{reply.error.message}</p>}
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Status</h3>
            <select
              value={t.status}
              onChange={(e) =>
                updateStatus.mutate({
                  ticketId: t.id,
                  status: e.target.value as typeof STATUSES[number],
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Priority</h3>
            <select
              value={t.priority}
              onChange={(e) =>
                updateStatus.mutate({
                  ticketId: t.id,
                  status: t.status as typeof STATUSES[number],
                  priority: e.target.value as typeof PRIORITIES[number],
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Assign */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Assigned to</h3>
            <select
              value={t.assignedToId ?? ""}
              onChange={(e) =>
                assign.mutate({
                  ticketId: t.id,
                  userId: e.target.value || null,
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {staffUsers
                .filter((u) => u.isActive)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Dates */}
          <div className="rounded-lg border p-4 text-sm">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground">Opened</dt>
                <dd className="font-medium">{formatDate(t.createdAt)}</dd>
              </div>
              {t.resolvedAt && (
                <div>
                  <dt className="text-muted-foreground">Resolved</dt>
                  <dd className="font-medium">{formatDate(t.resolvedAt)}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Messages</dt>
                <dd className="font-medium">{t.messages.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
