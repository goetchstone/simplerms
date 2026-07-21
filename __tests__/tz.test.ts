// __tests__/tz.test.ts
import { describe, it, expect } from "vitest";
import { weekdayInTz } from "@/lib/tz";

describe("weekdayInTz", () => {
  it("returns the weekday in the target timezone, not UTC", () => {
    // 2026-07-21T00:00Z is Tuesday in UTC, but 8 PM Monday in America/New_York.
    // The booking validator relies on getting the ET weekday (Monday = 1) so an
    // evening ET availability window isn't shifted to the wrong day.
    const eveningEt = new Date("2026-07-21T00:00:00Z");
    expect(eveningEt.getUTCDay()).toBe(2); // Tuesday in UTC — the trap
    expect(weekdayInTz(eveningEt, "America/New_York")).toBe(1); // Monday in ET
  });

  it("agrees with UTC when the instant doesn't cross a date boundary", () => {
    const noonEt = new Date("2026-07-20T16:00:00Z"); // noon Monday ET
    expect(weekdayInTz(noonEt, "America/New_York")).toBe(1);
    expect(weekdayInTz(noonEt, "UTC")).toBe(1);
  });
});
