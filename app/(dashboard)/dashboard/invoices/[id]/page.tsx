// app/(dashboard)/dashboard/invoices/[id]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createCachedCaller } from "@/lib/trpc/server";
import { InvoiceDetail } from "@/components/invoices/invoice-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const caller = await createCachedCaller();

  try {
    const invoice = await caller.invoices.byId(id);
    return <InvoiceDetail initialData={invoice} />;
  } catch {
    notFound();
  }
}
