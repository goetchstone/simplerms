// __tests__/tz.test.ts
import { describe, it, expect } from "vitest";
import { weekdayInTz, isValidTimeZone, formatInTz } from "@/lib/tz";

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

describe("isValidTimeZone", () => {
  it("accepts IANA zones", () => {
    expect(isValidTimeZone("America/New_York")).toBe(true);
    expect(isValidTimeZone("Pacific/Honolulu")).toBe(true);
    expect(isValidTimeZone("UTC")).toBe(true);
  });

  it("rejects values Intl would throw on at email time", () => {
    expect(isValidTimeZone("Not/AZone")).toBe(false);
    expect(isValidTimeZone("")).toBe(false);
    expect(isValidTimeZone("America/New_York\r\nBcc: x@y.z")).toBe(false);
  });
});

describe("formatInTz", () => {
  it("formats in the target zone with a zone label", () => {
    const threePmEdt = new Date("2026-10-05T19:00:00Z");
    expect(formatInTz(threePmEdt, "America/New_York")).toBe("Mon, Oct 5, 2026, 3:00 PM EDT");
    expect(formatInTz(threePmEdt, "America/Los_Angeles")).toBe("Mon, Oct 5, 2026, 12:00 PM PDT");
  });

  it("switches label across DST", () => {
    expect(formatInTz(new Date("2026-12-07T20:00:00Z"), "America/New_York")).toBe("Mon, Dec 7, 2026, 3:00 PM EST");
  });
});
