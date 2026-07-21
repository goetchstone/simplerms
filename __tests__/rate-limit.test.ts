// __tests__/rate-limit.test.ts
import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "@/server/rate-limit";

const headers = (h: Record<string, string>) => new Headers(h);

describe("getClientIp", () => {
  it("prefers X-Real-IP (set by our nginx, not spoofable)", () => {
    expect(getClientIp(headers({ "x-real-ip": "203.0.113.5", "x-forwarded-for": "evil, 203.0.113.5" }))).toBe("203.0.113.5");
  });

  it("uses the RIGHTMOST X-Forwarded-For entry (the one our proxy appended)", () => {
    // Client spoofs the left; nginx appends the true IP on the right.
    expect(getClientIp(headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 203.0.113.9" }))).toBe("203.0.113.9");
  });

  it("does not key on the spoofable leftmost value", () => {
    const a = getClientIp(headers({ "x-forwarded-for": "9.9.9.9, 203.0.113.9" }));
    const b = getClientIp(headers({ "x-forwarded-for": "8.8.8.8, 203.0.113.9" }));
    // Same real client → same key despite different spoofed leftmost values.
    expect(a).toBe(b);
    expect(a).toBe("203.0.113.9");
  });

  it("falls back to 'unknown' when no headers are present", () => {
    expect(getClientIp(headers({}))).toBe("unknown");
  });
});

const WINDOW_MS = 60_000;

function uniqueKey(label: string): string {
  // Each test gets its own key so the in-memory store doesn't carry state across.
  return `test:${label}:${Date.now()}:${Math.random()}`;
}

describe("rateLimit", () => {
  it("allows requests up to the limit", () => {
    const key = uniqueKey("under-limit");
    expect(rateLimit(key, 3, WINDOW_MS).allowed).toBe(true);
    expect(rateLimit(key, 3, WINDOW_MS).allowed).toBe(true);
    expect(rateLimit(key, 3, WINDOW_MS).allowed).toBe(true);
  });

  it("blocks the (limit+1)-th request", () => {
    const key = uniqueKey("at-limit");
    rateLimit(key, 3, WINDOW_MS);
    rateLimit(key, 3, WINDOW_MS);
    rateLimit(key, 3, WINDOW_MS);
    const blocked = rateLimit(key, 3, WINDOW_MS);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("isolates keys — one IP being limited doesn't affect another", () => {
    const ipA = uniqueKey("ip-a");
    const ipB = uniqueKey("ip-b");
    rateLimit(ipA, 1, WINDOW_MS); // ipA at limit
    expect(rateLimit(ipA, 1, WINDOW_MS).allowed).toBe(false);
    expect(rateLimit(ipB, 1, WINDOW_MS).allowed).toBe(true);
  });

  it("reports remaining capacity correctly", () => {
    const key = uniqueKey("remaining");
    expect(rateLimit(key, 5, WINDOW_MS).remaining).toBe(4);
    expect(rateLimit(key, 5, WINDOW_MS).remaining).toBe(3);
    expect(rateLimit(key, 5, WINDOW_MS).remaining).toBe(2);
  });
});
