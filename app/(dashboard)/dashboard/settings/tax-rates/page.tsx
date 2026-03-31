// app/(dashboard)/dashboard/settings/tax-rates/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { TaxRatesPanel } from "@/components/settings/tax-rates-panel";

export default async function TaxRatesPage() {
  const caller = await createCachedCaller();
  const rates = await caller.tax.list({ includeInactive: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tax rates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure simple and compound (tax-on-tax) rates applied to invoice lines.
        </p>
      </div>
      <TaxRatesPanel initialRates={rates} />
    </div>
  );
}
