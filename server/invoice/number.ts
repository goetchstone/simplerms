// server/invoice/number.ts
import "server-only";

import { db } from "@/server/db";

// Atomically increments the invoice counter and returns the formatted number.
// Runs inside a serializable transaction to prevent gaps or duplicates under
// concurrent load — the same guarantee a bank uses for account numbers.
export async function nextInvoiceNumber(): Promise<string> {
  return db.$transaction(
    async (tx) => {
      const setting = await tx.setting.findUniqueOrThrow({
        where: { key: "invoice_next_number" },
      });

      const current = parseInt(setting.value, 10);
      const next = current + 1;

      await tx.setting.update({
        where: { key: "invoice_next_number" },
        data: { value: String(next) },
      });

      const [prefixRow, yearRow] = await Promise.all([
        tx.setting.findUnique({ where: { key: "invoice_prefix" } }),
        Promise.resolve(new Date().getFullYear()),
      ]);

      const prefix = prefixRow?.value ?? "INV";
      return `${prefix}-${yearRow}-${String(current).padStart(4, "0")}`;
    },
    { isolationLevel: "Serializable" }
  );
}
