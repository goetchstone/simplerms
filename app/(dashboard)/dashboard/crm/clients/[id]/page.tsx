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

  try {
    const client = await caller.crm.clientById(id);
    return <ClientDetail initialData={client} />;
  } catch {
    notFound();
  }
}
