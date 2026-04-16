// app/(dashboard)/dashboard/invoices/[id]/edit/page.tsx
export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { createCachedCaller } from "@/lib/trpc/server";
import { InvoiceEditForm } from "@/components/invoices/invoice-edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: Props) {
  const { id } = await params;
  const caller = await createCachedCaller();

  try {
    const invoice = await caller.invoices.byId(id);

    if (invoice.status !== "DRAFT") {
      redirect(`/dashboard/invoices/${id}`);
    }

    const [clients, taxRates] = await Promise.all([
      caller.crm.listClients({ page: 1, limit: 100 }),
      caller.tax.list({ includeInactive: false }),
    ]);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Only draft invoices can be edited.
          </p>
        </div>
        <InvoiceEditForm
          invoice={invoice}
          clients={clients.items}
          taxRates={taxRates}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
