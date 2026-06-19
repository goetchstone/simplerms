// __tests__/dmarc-dns.test.ts
import { describe, it, expect } from "vitest";
import { classifyDnsError, isDkimKeyRecord } from "@/lib/dmarc-dns";

describe("classifyDnsError", () => {
  it("treats NXDOMAIN / no-data as a genuinely missing record", () => {
    expect(classifyDnsError({ code: "ENOTFOUND" })).toBe("missing");
    expect(classifyDnsError({ code: "ENODATA" })).toBe("missing");
  });

  it("treats resolver failures as transient, never a verdict", () => {
    expect(classifyDnsError({ code: "ESERVFAIL" })).toBe("transient");
    expect(classifyDnsError({ code: "ETIMEOUT" })).toBe("transient");
    expect(classifyDnsError({ code: "ECONNREFUSED" })).toBe("transient");
    expect(classifyDnsError(new Error("boom"))).toBe("transient");
    expect(classifyDnsError(null)).toBe("transient");
  });
});

describe("isDkimKeyRecord", () => {
  it("accepts real DKIM key records", () => {
    expect(isDkimKeyRecord("v=DKIM1; k=rsa; p=MIGfMA0GCSq")).toBe(true);
    expect(isDkimKeyRecord("k=rsa; p=MIGfMA0GCSq")).toBe(true); // v= tag omitted
    expect(isDkimKeyRecord("v=DKIM1; p=")).toBe(true); // revoked, still a DKIM record
  });

  it("rejects unrelated TXT records at the probed name", () => {
    expect(isDkimKeyRecord("v=spf1 include:_spf.google.com -all")).toBe(false);
    expect(isDkimKeyRecord("google-site-verification=abc123")).toBe(false);
    expect(isDkimKeyRecord("MS=ms12345678")).toBe(false);
    expect(isDkimKeyRecord("")).toBe(false);
  });
});
