// components/tickets/ticket-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RouterOutputs } from "@/lib/trpc/client";

type TicketListOutput = RouterOutputs["tickets"]["list"];

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const priorityLabel: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const priorityColor: Record<string, string> = {
  URGENT: "text-red-600 font-semibold",
  HIGH: "text-orange-600 font-medium",
  MEDIUM: "text-yellow-600",
  LOW: "text-zinc-400",
};

export function TicketList({ initialData }: { initialData: TicketListOutput }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("open");

  type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_ON_CLIENT" | "RESOLVED" | "CLOSED";
  const statusParam: TicketStatus | undefined =
    statusFilter === "open" ? undefined : (statusFilter as TicketStatus);

  const { data } = trpc.tickets.list.useQuery(
    { page: 1, limit: 50, status: statusParam },
    { initialData: statusFilter === "open" ? initialData : undefined, placeholderData: (prev) => prev }
  );

  const items = data?.items ?? initialData.items;

  return (
    <>
      <div className="flex gap-2">
        {["open", "IN_PROGRESS", "WAITING_ON_CLIENT", "RESOLVED", "CLOSED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {s === "open" ? "All open" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Opened</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No tickets.
                </TableCell>
              </TableRow>
            )}
            {items.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/tickets/${t.id}`)}
              >
                <TableCell className="font-mono text-sm font-medium">{t.ticketNumber}</TableCell>
                <TableCell className="max-w-xs truncate font-medium">{t.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.client?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <span className={`text-xs ${priorityColor[t.priority]}`}>
                    {priorityLabel[t.priority]}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.assignedTo?.name ?? "Unassigned"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(t.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
