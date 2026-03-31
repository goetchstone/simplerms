// __tests__/invoice-tax.test.ts
import { describe, it, expect } from "vitest";
import { computeInvoice } from "@/server/invoice/tax";

describe("computeInvoice", () => {
  it("computes a single line with no taxes", () => {
    const result = computeInvoice([
      { quantity: 2, unitPrice: 50, taxRates: [] },
    ]);
    expect(result.subtotal).toBe(100);
    expect(result.taxTotal).toBe(0);
    expect(result.total).toBe(100);
  });

  it("applies a single simple tax rate", () => {
    const result = computeInvoice([
      {
        quantity: 1,
        unitPrice: 100,
        taxRates: [{ id: "t1", name: "GST", rate: 0.05, isCompound: false }],
      },
    ]);
    expect(result.subtotal).toBe(100);
    expect(result.taxTotal).toBe(5);
    expect(result.total).toBe(105);
    expect(result.lines[0].taxes[0].taxAmount).toBe(5);
  });

  it("applies compound tax on top of simple tax", () => {
    // Compound (QST in Quebec) applies to subtotal + GST.
    // Line: $100, GST 5% = $5, QST 9.975% on $105 = $10.47
    const result = computeInvoice([
      {
        quantity: 1,
        unitPrice: 100,
        taxRates: [
          { id: "gst", name: "GST", rate: 0.05, isCompound: false },
          { id: "qst", name: "QST", rate: 0.09975, isCompound: true },
        ],
      },
    ]);
    expect(result.subtotal).toBe(100);
    // GST: 100 * 0.05 = 5.00
    // QST: (100 + 5) * 0.09975 = 10.47 (rounded)
    const gst = result.lines[0].taxes.find((t) => t.taxRateId === "gst")!;
    const qst = result.lines[0].taxes.find((t) => t.taxRateId === "qst")!;
    expect(gst.taxAmount).toBe(5);
    expect(qst.taxAmount).toBe(10.47);
    expect(result.total).toBe(115.47);
  });

  it("sums multiple lines correctly", () => {
    const result = computeInvoice([
      { quantity: 3, unitPrice: 10, taxRates: [] },
      { quantity: 1, unitPrice: 25.5, taxRates: [] },
    ]);
    expect(result.subtotal).toBe(55.5);
    expect(result.total).toBe(55.5);
  });

  it("handles decimal quantities", () => {
    const result = computeInvoice([
      { quantity: 1.5, unitPrice: 100, taxRates: [] },
    ]);
    expect(result.subtotal).toBe(150);
  });
});
