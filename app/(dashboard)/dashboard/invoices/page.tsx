// app/(dashboard)/dashboard/invoices/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { InvoiceList } from "@/components/invoices/invoice-list";

export default async function InvoicesPage() {
  const caller = await createCachedCaller();
  const result = await caller.invoices.list({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Issue, track, and collect payment on all client invoices.
        </p>
      </div>
      <InvoiceList initialData={result} />
    </div>
  );
}
