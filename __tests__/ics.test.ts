// __tests__/ics.test.ts
import { describe, it, expect } from "vitest";
import { buildIcs, type IcsEvent } from "@/lib/ics";

const base: IcsEvent = {
  uid: "appt123@akritos.com",
  method: "PUBLISH",
  start: new Date("2026-10-05T15:00:00Z"),
  end: new Date("2026-10-05T15:30:00Z"),
  stamp: new Date("2026-09-30T12:00:00Z"),
  summary: "Free Consultation",
  organizer: { name: "Akritos", email: "hello@akritos.com" },
};

const unfold = (ics: string) => ics.replace(/\r\n /g, "");
const lines = (ics: string) => unfold(ics).split("\r\n").filter(Boolean);

describe("buildIcs", () => {
  it("emits a CRLF-delimited VCALENDAR with UTC times", () => {
    const ics = buildIcs(base);
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/\n/);
    const l = lines(ics);
    expect(l[0]).toBe("BEGIN:VCALENDAR");
    expect(l.at(-1)).toBe("END:VCALENDAR");
    expect(l).toContain("METHOD:PUBLISH");
    expect(l).toContain("SEQUENCE:0");
    expect(l).toContain("DTSTART:20261005T150000Z");
    expect(l).toContain("DTEND:20261005T153000Z");
    expect(l).toContain('ORGANIZER;CN="Akritos":mailto:hello@akritos.com');
    expect(l).toContain("STATUS:CONFIRMED");
  });

  it("never lists attendees (RFC 5546 forbids them on PUBLISH)", () => {
    expect(lines(buildIcs(base)).some((x) => x.startsWith("ATTENDEE"))).toBe(false);
  });

  it("marks a cancellation with a higher sequence", () => {
    const l = lines(buildIcs({ ...base, method: "CANCEL" }));
    expect(l).toContain("METHOD:CANCEL");
    expect(l).toContain("SEQUENCE:1");
    expect(l).toContain("STATUS:CANCELLED");
  });

  it("escapes TEXT so visitor input cannot inject properties", () => {
    const l = lines(
      buildIcs({
        ...base,
        summary: "Call; with, commas \\ and slashes",
        description: "Notes line 1\r\nATTENDEE:mailto:evil@example.com\nEND:VEVENT",
      })
    );
    expect(l).toContain("SUMMARY:Call\\; with\\, commas \\\\ and slashes");
    expect(l).toContain("DESCRIPTION:Notes line 1\\nATTENDEE:mailto:evil@example.com\\nEND:VEVENT");
    expect(l.some((x) => x.startsWith("ATTENDEE"))).toBe(false);
    expect(l.filter((x) => x === "END:VEVENT").length).toBe(1);
  });

  it("drops control characters strict parsers reject, keeping tabs", () => {
    const l = lines(buildIcs({ ...base, summary: "Pat\x00\x0b\x1b\x7f\tClient" }));
    expect(l).toContain("SUMMARY:Pat\tClient");
  });

  it("strips quotes and line breaks from the organizer", () => {
    const l = lines(
      buildIcs({ ...base, organizer: { name: 'Ak "x"\r\nX-EVIL:1', email: "hello@akritos.com\r\n;SENT-BY=x" } })
    );
    expect(l.filter((x) => x.startsWith("ORGANIZER"))).toEqual(['ORGANIZER;CN="Ak xX-EVIL:1":mailto:hello@akritos.comSENT-BY=x']);
    expect(l.some((x) => x.startsWith("X-EVIL"))).toBe(false);
  });

  it("folds long lines at 75 octets without splitting multi-byte characters", () => {
    const description = "Café ☕ résumé — ".repeat(20) + "終わり";
    const ics = buildIcs({ ...base, description });
    const encoder = new TextEncoder();
    for (const physical of ics.split("\r\n")) {
      expect(encoder.encode(physical).length).toBeLessThanOrEqual(75);
    }
    expect(lines(ics)).toContain(`DESCRIPTION:${description}`);
  });
});
