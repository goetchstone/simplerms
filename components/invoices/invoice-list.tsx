// components/invoices/invoice-list.tsx
"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import type { RouterOutputs } from "@/lib/trpc/client";

type InvoiceListOutput = RouterOutputs["invoices"]["list"];

export function InvoiceList({ initialData }: { initialData: InvoiceListOutput }) {
  const router = useRouter();

  const { data } = trpc.invoices.list.useQuery(
    { page: 1, limit: 50 },
    { initialData, placeholderData: (prev) => prev }
  );

  const items = data?.items ?? initialData.items;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => router.push("/dashboard/invoices/new")}>
          <Plus className="mr-1.5 h-4 w-4" /> New invoice
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No invoices yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((inv) => (
              <TableRow
                key={inv.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
              >
                <TableCell className="font-mono text-sm font-medium">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{inv.client.name}</span>
                  {inv.client.company && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {inv.client.company}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(inv.issueDate)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-medium">
                  {formatCurrency(Number(inv.total), inv.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
