// app/(portal)/portal/[token]/tickets/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export default async function PortalTicketsPage({
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

  const tickets = await db.ticket.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    select: {
      ticketNumber: true,
      subject: true,
      status: true,
      priority: true,
      publicToken: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href={`/portal/${token}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Support tickets</h1>

        {tickets.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets yet.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link
                key={t.publicToken}
                href={`/support/track?token=${t.publicToken}`}
                className="block rounded-xl border bg-white px-6 py-4 shadow-sm transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {t.ticketNumber}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  <StatusBadge status={t.priority} />
                </div>
                <p className="mt-1 text-sm text-gray-700">{t.subject}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Opened {formatDate(t.createdAt)} · Updated {formatDate(t.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
