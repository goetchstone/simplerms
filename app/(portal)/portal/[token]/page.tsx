// app/(portal)/portal/[token]/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, MessageSquare, Calendar } from "lucide-react";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await db.client.findUnique({
    where: { portalToken: token, isActive: true },
    select: {
      name: true,
      company: true,
      _count: { select: { invoices: true, tickets: true, appointments: true } },
    },
  });

  if (!client) notFound();

  const companyName = (
    await db.setting.findUnique({ where: { key: "company_name" } })
  )?.value ?? "Akritos";

  const links = [
    { href: `/portal/${token}/invoices`, label: "Invoices", count: client._count.invoices, icon: FileText },
    { href: `/portal/${token}/tickets`, label: "Tickets", count: client._count.tickets, icon: MessageSquare },
    { href: `/portal/${token}/appointments`, label: "Appointments", count: client._count.appointments, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-gray-400">{companyName}</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{client.name}</h1>
          {client.company && (
            <p className="mt-0.5 text-sm text-gray-500">{client.company}</p>
          )}
        </div>

        <div className="space-y-3">
          {links.map(({ href, label, count, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
