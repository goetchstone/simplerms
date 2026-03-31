// __tests__/utils.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, round2 } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("accepts string amounts", () => {
    expect(formatCurrency("99.9")).toBe("$99.90");
  });

  it("respects currency argument", () => {
    expect(formatCurrency(100, "CAD")).toContain("100");
  });
});

describe("formatDate", () => {
  it("formats a date in readable form", () => {
    const result = formatDate(new Date("2026-01-15T00:00:00Z"));
    expect(result).toContain("2026");
  });

  it("accepts string dates", () => {
    const result = formatDate("2026-03-31");
    expect(result).toContain("2026");
  });
});

describe("round2", () => {
  it("rounds to two decimal places", () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(2.344)).toBe(2.34);
    expect(round2(2.345)).toBe(2.35);
  });

  it("handles whole numbers", () => {
    expect(round2(10)).toBe(10);
  });
});
