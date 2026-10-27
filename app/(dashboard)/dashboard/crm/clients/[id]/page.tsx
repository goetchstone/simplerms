// app/(dashboard)/dashboard/crm/clients/[id]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createCachedCaller } from "@/lib/trpc/server";
import { ClientDetail } from "@/components/crm/client-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const caller = await createCachedCaller();

  const client = await caller.crm.clientById(id).catch(() => notFound());
  return <ClientDetail initialData={client} />;
}
