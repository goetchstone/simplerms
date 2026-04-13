// app/(dashboard)/dashboard/invoices/new/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { InvoiceCreateForm } from "@/components/invoices/invoice-create-form";

interface Props {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function NewInvoicePage({ searchParams }: Props) {
  const { clientId } = await searchParams;
  const caller = await createCachedCaller();

  const [clients, taxRates] = await Promise.all([
    caller.crm.listClients({ page: 1, limit: 100 }),
    caller.tax.list({ includeInactive: false }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and issue an invoice with automatic tax calculation.
        </p>
      </div>
      <InvoiceCreateForm
        clients={clients.items}
        taxRates={taxRates}
        defaultClientId={clientId}
      />
    </div>
  );
}
