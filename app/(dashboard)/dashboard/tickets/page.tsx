// app/(dashboard)/dashboard/tickets/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { TicketList } from "@/components/tickets/ticket-list";

export default async function TicketsPage() {
  const caller = await createCachedCaller();
  const result = await caller.tickets.list({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Support tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All client support requests, sorted by priority.
        </p>
      </div>
      <TicketList initialData={result} />
    </div>
  );
}
