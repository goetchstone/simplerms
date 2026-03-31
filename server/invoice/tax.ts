// server/invoice/tax.ts
import "server-only";

import { round2 } from "@/lib/utils";

export interface TaxRateInput {
  id: string;
  name: string;
  rate: number; // decimal, e.g. 0.0825
  isCompound: boolean;
}

export interface LineInput {
  quantity: number;
  unitPrice: number;
  taxRates: TaxRateInput[];
}

export interface ComputedLineTax {
  taxRateId: string;
  taxAmount: number;
}

export interface ComputedLine {
  lineTotal: number;
  taxes: ComputedLineTax[];
  lineTaxTotal: number;
}

export interface ComputedInvoice {
  subtotal: number;
  taxTotal: number;
  total: number;
  lines: ComputedLine[];
}

// Applies simple then compound taxes per line.
// Simple taxes are applied to the line subtotal.
// Compound taxes are applied to (line subtotal + simple tax total) — the
// "tax on tax" model used in jurisdictions like Canada (HST stacking).
function computeLine(line: LineInput): ComputedLine {
  const lineTotal = round2(line.quantity * line.unitPrice);

  const simpleTaxes = line.taxRates.filter((t) => !t.isCompound);
  const compoundTaxes = line.taxRates.filter((t) => t.isCompound);

  const taxes: ComputedLineTax[] = [];
  let simpleTaxTotal = 0;

  for (const t of simpleTaxes) {
    const amount = round2(lineTotal * t.rate);
    taxes.push({ taxRateId: t.id, taxAmount: amount });
    simpleTaxTotal += amount;
  }

  const compoundBase = lineTotal + simpleTaxTotal;
  for (const t of compoundTaxes) {
    const amount = round2(compoundBase * t.rate);
    taxes.push({ taxRateId: t.id, taxAmount: amount });
  }

  const lineTaxTotal = taxes.reduce((sum, t) => sum + t.taxAmount, 0);

  return { lineTotal, taxes, lineTaxTotal };
}

export function computeInvoice(lines: LineInput[]): ComputedInvoice {
  const computed = lines.map(computeLine);

  const subtotal = round2(computed.reduce((sum, l) => sum + l.lineTotal, 0));
  const taxTotal = round2(computed.reduce((sum, l) => sum + l.lineTaxTotal, 0));
  const total = round2(subtotal + taxTotal);

  return { subtotal, taxTotal, total, lines: computed };
}
