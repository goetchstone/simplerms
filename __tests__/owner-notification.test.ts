// __tests__/owner-notification.test.ts
import { describe, it, expect } from "vitest";
import { ownerNotificationHtml, ownerNotificationText } from "@/server/email/templates/owner-notification";
import { appointmentConfirmationHtml, appointmentConfirmationText } from "@/server/email/templates/appointment";
import { appointmentReminderText } from "@/server/email/templates/appointment-reminder";

const notice = {
  heading: "New booking",
  rows: [
    ["Name", `<img src=x onerror=alert(1)> "Pat"`],
    ["Phone", null],
    ["Notes", "line one\nline two"],
  ] as Array<[string, string | null]>,
  link: { href: "https://akritos.com/dashboard/scheduling", label: "Open scheduling" },
};

describe("ownerNotificationHtml", () => {
  it("escapes visitor-supplied values", () => {
    const html = ownerNotificationHtml(notice);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt; &quot;Pat&quot;");
  });

  it("keeps line breaks in multi-line values and drops empty rows", () => {
    const html = ownerNotificationHtml(notice);
    expect(html).toContain("line one<br />line two");
    expect(html).not.toContain("Phone");
  });

  it("renders a plain-text version with the link", () => {
    const text = ownerNotificationText(notice);
    expect(text).toContain("Notes: line one\nline two");
    expect(text).not.toContain("Phone");
    expect(text).toContain("Open scheduling: https://akritos.com/dashboard/scheduling");
  });
});

describe("appointment confirmation", () => {
  const data = {
    serviceName: "Free Consultation",
    bookerName: "Pat",
    startsAt: new Date("2026-10-05T15:00:00Z"),
    duration: 30,
    timezone: "America/Los_Angeles",
    cancelUrl: "https://akritos.com/portal/appointments/cancel?token=abc",
    companyName: "Akritos",
  };

  it("shows date and time in the booker's zone, labeled", () => {
    const html = appointmentConfirmationHtml(data);
    expect(html).toContain("Mon, Oct 5, 2026");
    expect(html).toContain("8:00 AM PDT");
    expect(appointmentConfirmationText(data)).toContain("Time: 8:00 AM PDT");
  });

  it("uses the date in the booker's zone, not the server's", () => {
    // 11:30 PM Sunday in LA is already Monday in UTC.
    const late = { ...data, startsAt: new Date("2026-10-05T06:30:00Z") };
    expect(appointmentConfirmationText(late)).toContain("Date: Sun, Oct 4, 2026");
  });

  it("formats the reminder the same way", () => {
    const text = appointmentReminderText({ ...data, startsAt: new Date("2026-10-05T06:30:00Z") });
    expect(text).toContain("Date: Sun, Oct 4, 2026");
    expect(text).toContain("Time: 11:30 PM PDT");
  });
});
