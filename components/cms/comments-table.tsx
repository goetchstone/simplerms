// components/cms/comments-table.tsx
"use client";

import { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { Check, X, Trash2, AlertTriangle } from "lucide-react";
import type { AppRouter } from "@/server/trpc/root";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
type ListPendingOutput = inferRouterOutputs<AppRouter>["comments"]["listPending"];

interface Props {
  initialData: ListPendingOutput;
  initialStatus: Status;
}

const STATUS_TABS: Status[] = ["PENDING", "APPROVED", "REJECTED", "SPAM"];

export function CommentsTable({ initialData, initialStatus }: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const utils = trpc.useUtils();

  const query = trpc.comments.listPending.useQuery(
    { status, page: 1, limit: 50 },
    { initialData: status === initialStatus ? initialData : undefined }
  );

  function refresh() {
    utils.comments.listPending.invalidate();
    utils.comments.pendingCount.invalidate();
  }

  const approve = trpc.comments.approve.useMutation({ onSuccess: refresh });
  const reject = trpc.comments.reject.useMutation({ onSuccess: refresh });
  const markSpam = trpc.comments.markSpam.useMutation({ onSuccess: refresh });
  const del = trpc.comments.delete.useMutation({ onSuccess: refresh });

  const items = query.data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-2 text-sm transition-colors ${
              s === status
                ? "border-b-2 border-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No {status.toLowerCase()} comments.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="space-y-3 rounded-md border bg-card p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <div>
                  <span className="font-medium">{c.authorName}</span>
                  <span className="text-muted-foreground"> &lt;{c.authorEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <a
                    href={`/blog/${c.post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    {c.post.title}
                  </a>
                  <span>·</span>
                  <time dateTime={c.createdAt.toISOString()}>{formatDate(c.createdAt)}</time>
                  {c.ipAddress && <><span>·</span><span>IP: {c.ipAddress}</span></>}
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.content}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {status !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => approve.mutate({ id: c.id })}
                    disabled={approve.isPending}
                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {status !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => reject.mutate({ id: c.id })}
                    disabled={reject.isPending}
                    className="inline-flex items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
                {status !== "SPAM" && (
                  <button
                    type="button"
                    onClick={() => markSpam.mutate({ id: c.id })}
                    disabled={markSpam.isPending}
                    className="inline-flex items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Spam
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this comment permanently?")) {
                      del.mutate({ id: c.id });
                    }
                  }}
                  disabled={del.isPending}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-background px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
