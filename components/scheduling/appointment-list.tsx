// components/scheduling/appointment-list.tsx
"use client";

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

type AppointmentListOutput = RouterOutputs["scheduling"]["listAppointments"];

export function AppointmentList({ initialData }: { initialData: AppointmentListOutput }) {
  const { data } = trpc.scheduling.listAppointments.useQuery(
    { page: 1, limit: 50 },
    { initialData, placeholderData: (prev) => prev }
  );

  const items = data?.items ?? initialData.items;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date &amp; time</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Booker</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                No appointments.
              </TableCell>
            </TableRow>
          )}
          {items.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="text-sm">
                <p className="font-medium">{formatDate(a.startsAt)}</p>
                <p className="text-muted-foreground">
                  {new Date(a.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" — "}
                  {new Date(a.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </TableCell>
              <TableCell className="font-medium">{a.service.name}</TableCell>
              <TableCell className="text-sm">
                <p>{a.bookerName}</p>
                <p className="text-muted-foreground">{a.bookerEmail}</p>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.staff?.name ?? "—"}
              </TableCell>
              <TableCell>
                <StatusBadge status={a.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
