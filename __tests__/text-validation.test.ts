// __tests__/text-validation.test.ts
import { describe, it, expect } from "vitest";
import { lineText, multilineText } from "@/lib/validations/text";

describe("lineText", () => {
  it("drops every control character, including line breaks", () => {
    expect(lineText(255).parse("Pat\x00\x1b\r\nBcc: x\x7f")).toBe("PatBcc: x");
  });

  it("applies limits after stripping", () => {
    expect(lineText(255, 1).safeParse("\x00\x1b").success).toBe(false);
    expect(lineText(3).parse("ab\x00c")).toBe("abc");
    expect(lineText(3).safeParse("abcd").success).toBe(false);
  });
});

describe("multilineText", () => {
  it("keeps newlines and tabs, drops other controls", () => {
    expect(multilineText(100).parse("line one\r\n\tline two\x00\x07")).toBe("line one\r\n\tline two");
  });
});
