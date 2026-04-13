// app/(dashboard)/dashboard/tickets/[id]/page.tsx
import { notFound } from "next/navigation";
import { createCachedCaller } from "@/lib/trpc/server";
import { TicketDetail } from "@/components/tickets/ticket-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { id } = await params;
  const caller = await createCachedCaller();

  try {
    const [ticket, users] = await Promise.all([
      caller.tickets.byId(id),
      caller.users.list(),
    ]);
    return <TicketDetail initialData={ticket} staffUsers={users} />;
  } catch {
    notFound();
  }
}
