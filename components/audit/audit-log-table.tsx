// components/audit/audit-log-table.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
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
import type { RouterOutputs } from "@/lib/trpc/client";

type AuditListOutput = RouterOutputs["audit"]["list"];

export function AuditLogTable({ initialData }: { initialData: AuditListOutput }) {
  const [detail, setDetail] = useState<AuditListOutput["items"][number] | null>(null);
  const [page, setPage] = useState(1);

  const { data } = trpc.audit.list.useQuery(
    { page, limit: 50 },
    { initialData: page === 1 ? initialData : undefined, placeholderData: (prev) => prev }
  );

  const { items, total, pages } = data ?? initialData;

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>By</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No audit entries yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => setDetail(entry)}
              >
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(entry.createdAt)}
                </TableCell>
                <TableCell className="font-mono text-xs">{entry.action}</TableCell>
                <TableCell className="text-sm">
                  {entry.entityType && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 mr-1.5">
                      {entry.entityType}
                    </span>
                  )}
                  {entry.entityId && (
                    <span className="font-mono text-xs text-muted-foreground">{entry.entityId.slice(0, 8)}…</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.user?.name ?? entry.user?.email ?? "System"}
                </TableCell>
                <TableCell className="text-right">
                  {(entry.before || entry.after) && (
                    <span className="text-xs text-blue-600 hover:underline">Diff</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{total} total entries</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-accent"
            >
              Previous
            </button>
            <span className="px-2 py-1">{page} / {pages}</span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-accent"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Diff dialog */}
      <Dialog open={!!detail} onOpenChange={(v) => { if (!v) setDetail(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">{detail?.action}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p className="mb-1 font-semibold text-foreground">Entity</p>
                  <p>{detail.entityType} / {detail.entityId}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-foreground">When</p>
                  <p>{formatDate(detail.createdAt)}</p>
                </div>
              </div>
              {detail.before && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Before</p>
                  <pre className="overflow-auto rounded-lg bg-red-50 p-3 text-xs text-red-800">
                    {JSON.stringify(detail.before, null, 2)}
                  </pre>
                </div>
              )}
              {detail.after && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">After</p>
                  <pre className="overflow-auto rounded-lg bg-green-50 p-3 text-xs text-green-800">
                    {JSON.stringify(detail.after, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
