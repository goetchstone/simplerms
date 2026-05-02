// components/cms/leads-table.tsx
"use client";

import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import type { AppRouter } from "@/server/trpc/root";
import { CheckCircle2, Circle } from "lucide-react";

type ListOutput = inferRouterOutputs<AppRouter>["leads"]["list"];

interface Props {
  initialData: ListOutput;
}

export function LeadsTable({ initialData }: Props) {
  const query = trpc.leads.list.useQuery({ page: 1, limit: 50 }, { initialData });
  const items = query.data?.items ?? [];

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No leads yet. They&apos;ll appear here as visitors request the checklist or other lead magnets.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Company</th>
            <th className="px-4 py-2 font-medium">Source</th>
            <th className="px-4 py-2 font-medium">Captured</th>
            <th className="px-4 py-2 font-medium" title="Did they click the download link?">DL</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((lead) => (
            <tr key={lead.id} className="hover:bg-muted/20">
              <td className="px-4 py-2 font-mono text-xs">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {lead.email}
                </a>
              </td>
              <td className="px-4 py-2">{lead.name ?? "—"}</td>
              <td className="px-4 py-2">{lead.company ?? "—"}</td>
              <td className="px-4 py-2 text-xs text-muted-foreground">{lead.source}</td>
              <td className="px-4 py-2 text-xs text-muted-foreground">
                <time dateTime={lead.createdAt.toISOString()}>{formatDate(lead.createdAt)}</time>
              </td>
              <td className="px-4 py-2">
                {lead.downloadedAt ? (
                  <span title={`Downloaded ${formatDate(lead.downloadedAt)}`}>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </span>
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
