// __tests__/safe-redirect.test.ts
import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "@/lib/safe-redirect";

const ORIGIN = "https://akritos.com";

describe("safeRedirectPath", () => {
  it("keeps same-origin paths, including query and hash", () => {
    expect(safeRedirectPath("/dashboard/invoices?status=open#top", ORIGIN)).toBe(
      "/dashboard/invoices?status=open#top"
    );
  });

  it("reduces a same-origin absolute URL to its path", () => {
    expect(safeRedirectPath("https://akritos.com/dashboard/settings", ORIGIN)).toBe("/dashboard/settings");
  });

  it.each([
    ["protocol-relative", "//evil.example"],
    ["backslash host", "/\\evil.example"],
    ["double backslash", "/\\\\evil.example"],
    ["mixed slashes", "\\/evil.example"],
    ["tab-split slashes", "/\t/evil.example"],
    ["newline-split slashes", "/\n/evil.example"],
    ["absolute foreign URL", "https://evil.example/dashboard"],
    ["lookalike host", "https://akritos.com.evil.example/"],
    ["other scheme on our host", "http://akritos.com/dashboard"],
    ["javascript URL", "javascript:alert(1)"],
    ["data URL", "data:text/html,<script>alert(1)</script>"],
  ])("rejects %s", (_label, raw) => {
    expect(safeRedirectPath(raw, ORIGIN)).toBe("/dashboard");
  });

  it("falls back when missing or empty", () => {
    expect(safeRedirectPath(null, ORIGIN)).toBe("/dashboard");
    expect(safeRedirectPath("", ORIGIN)).toBe("/dashboard");
  });

  it("uses the caller's fallback", () => {
    expect(safeRedirectPath("//evil.example", ORIGIN, "/")).toBe("/");
  });
});
