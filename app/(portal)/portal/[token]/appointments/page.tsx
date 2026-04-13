// app/(portal)/portal/[token]/appointments/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

export default async function PortalAppointmentsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await db.client.findUnique({
    where: { portalToken: token, isActive: true },
    select: { id: true },
  });
  if (!client) notFound();

  const appointments = await db.appointment.findMany({
    where: { clientId: client.id },
    orderBy: { startsAt: "desc" },
    include: {
      service: { select: { name: true } },
    },
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href={`/portal/${token}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
          <Link
            href="/book"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Book new
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {a.service.name}
                    </span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {formatDate(a.startsAt)} at {formatTime(a.startsAt, a.timezone)}
                  </p>
                </div>
                {a.status === "CONFIRMED" && a.startsAt > now && a.cancelToken && (
                  <Link
                    href={`/portal/appointments/cancel?token=${a.cancelToken}`}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Cancel
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
