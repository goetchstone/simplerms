// __tests__/content-disposition.test.ts
import { describe, it, expect } from "vitest";
import { contentDisposition } from "@/lib/content-disposition";

// The real failure: undici rejects any header value that isn't a ByteString.
const isByteString = (v: string) => [...v].every((c) => c.charCodeAt(0) <= 0xff);

describe("contentDisposition", () => {
  it("passes plain ASCII names through", () => {
    expect(contentDisposition("inline", "report.pdf")).toBe(
      `inline; filename="report.pdf"; filename*=UTF-8''report.pdf`
    );
  });

  it("encodes a macOS screenshot name (U+202F before AM)", () => {
    const name = "Screenshot 2026-09-30 at 10.52.11\u202fAM.png";
    const header = contentDisposition("inline", name);
    expect(isByteString(header)).toBe(true);
    expect(header).toContain(`filename="Screenshot 2026-09-30 at 10.52.11_AM.png"`);
    expect(header).toContain("filename*=UTF-8''Screenshot%202026-09-30%20at%2010.52.11%E2%80%AFAM.png");
    expect(() => new Response("x", { headers: { "Content-Disposition": header } })).not.toThrow();
  });

  it("encodes CJK and emoji names", () => {
    const header = contentDisposition("attachment", "請求書 🧾.pdf");
    expect(isByteString(header)).toBe(true);
    expect(decodeURIComponent(header.split("UTF-8''")[1])).toBe("請求書 🧾.pdf");
  });

  it("cannot be broken out of by quotes, backslashes, CR/LF, or RFC 5987 delimiters", () => {
    const header = contentDisposition("inline", `a"b\\c\r\nSet-Cookie: x=1'(*).txt`);
    expect(header).not.toMatch(/[\r\n]/);
    expect(header).toContain(`filename="a_b_c__Set-Cookie: x=1'(*).txt"`);
    expect(header.split("UTF-8''")[1]).not.toMatch(/['()*"\\]/);
  });
});
