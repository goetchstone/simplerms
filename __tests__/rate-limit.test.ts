// __tests__/rate-limit.test.ts
import { describe, it, expect } from "vitest";
import { rateLimit } from "@/server/rate-limit";

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
