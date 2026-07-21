// __tests__/email-escape.test.ts
import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/server/email/escape";
import { ticketReplyHtml, ticketConfirmationHtml } from "@/server/email/templates/ticket";
import { appointmentConfirmationHtml } from "@/server/email/templates/appointment";

describe("escapeHtml", () => {
  it("neutralizes every HTML-significant character", () => {
    expect(escapeHtml(`<script>alert("x")&'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&amp;&#39;"
    );
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Goetch Stone")).toBe("Goetch Stone");
  });

  it("escapes & before entity-encoding so it can't be double-decoded", () => {
    // "&lt;" in input must become "&amp;lt;", not stay "&lt;".
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });
});

// The whole point of the change: attacker-controlled fields must not reach the
// recipient's inbox as live markup. These assert the payload is neutralized in
// the actual rendered templates, not just in the helper.
describe("email templates escape injected markup", () => {
  const payload = `<img src=x onerror=alert(1)>`;

  it("ticket reply body (reaches staff) is escaped", () => {
    const html = ticketReplyHtml({
      ticketNumber: "TKT-1",
      subject: payload,
      submitterName: payload,
      replyBody: payload,
      replierName: "Staff",
      trackUrl: "https://akritos.com/support/track?token=abc",
      companyName: "Akritos",
    });
    expect(html).not.toContain("<img src=x onerror=alert(1)>");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("ticket confirmation subject/name are escaped", () => {
    const html = ticketConfirmationHtml({
      ticketNumber: "TKT-1",
      subject: payload,
      submitterName: payload,
      trackUrl: "https://akritos.com/x",
      companyName: "Akritos",
    });
    expect(html).not.toContain("<img src=x");
  });

  it("appointment confirmation name/service/notes are escaped", () => {
    const html = appointmentConfirmationHtml({
      serviceName: payload,
      bookerName: payload,
      startsAt: new Date("2026-07-01T15:00:00Z"),
      duration: 30,
      timezone: "America/New_York",
      cancelUrl: "https://akritos.com/book/cancel?token=abc",
      companyName: "Akritos",
      notes: payload,
    });
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x");
  });
});
