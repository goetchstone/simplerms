// lib/ics.ts

export interface IcsOrganizer {
  name?: string;
  email: string;
}

// PUBLISH is a plain "add this event": no RSVP buttons, so nobody mistakes
// declining for cancelling, and no ATTENDEE (RFC 5546 forbids it here), so a
// CalDAV calendar can't re-invite the booker on the owner's behalf. CANCEL
// with the same UID removes it.
export interface IcsEvent {
  uid: string;
  method: "PUBLISH" | "CANCEL";
  start: Date;
  end: Date;
  stamp: Date;
  summary: string;
  description?: string;
  organizer?: IcsOrganizer;
}

// RFC 5545 TEXT escaping. Summary and description carry visitor input: an
// unescaped newline would inject properties, and other control characters
// make strict parsers (Outlook) drop the whole event.
function text(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, "");
}

// Parameter values can't contain DQUOTE or control characters.
function param(value: string): string {
  return value.replace(/["\x00-\x1f\x7f]/g, "");
}

function mailto(email: string): string {
  return email.replace(/[\s"<>;:,\\]/g, "");
}

function utc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// Content lines are capped at 75 octets. Fold on code points so a multi-byte
// character is never split across lines.
function fold(line: string): string {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildIcs(e: IcsEvent): string {
  const cancel = e.method === "CANCEL";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Akritos//Scheduling//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${e.method}`,
    "BEGIN:VEVENT",
    `UID:${text(e.uid)}`,
    `SEQUENCE:${cancel ? 1 : 0}`,
    `DTSTAMP:${utc(e.stamp)}`,
    `DTSTART:${utc(e.start)}`,
    `DTEND:${utc(e.end)}`,
    `SUMMARY:${text(e.summary)}`,
    ...(e.description ? [`DESCRIPTION:${text(e.description)}`] : []),
    ...(e.organizer
      ? [`ORGANIZER${e.organizer.name ? `;CN="${param(e.organizer.name)}"` : ""}:mailto:${mailto(e.organizer.email)}`]
      : []),
    `STATUS:${cancel ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
