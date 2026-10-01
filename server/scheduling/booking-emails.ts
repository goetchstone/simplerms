// server/scheduling/booking-emails.ts
import "server-only";
import type { Appointment, Service } from "@prisma/client";
import { db } from "@/server/db";
import { sendEmail } from "@/server/email";
import { companyEmail, notifyOwner, ownerRecipients } from "@/server/email/notify-owner";
import {
  appointmentConfirmationHtml,
  appointmentConfirmationText,
  appointmentCancellationHtml,
  appointmentCancellationText,
} from "@/server/email/templates/appointment";
import { ownerNotificationHtml, ownerNotificationText, type OwnerNotification } from "@/server/email/templates/owner-notification";
import { buildIcs, type IcsEvent, type IcsOrganizer } from "@/lib/ics";
import { formatInTz } from "@/lib/tz";

const baseUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Shared by the confirmation and the reminder so the link can't drift again
// (it once pointed at a route that didn't exist).
export function appointmentCancelUrl(cancelToken: string): string {
  return `${baseUrl()}/portal/appointments/cancel?token=${cancelToken}`;
}

interface Context {
  company: string;
  owners: string[];
  // Only the public company address is ever shown to a booker; without it the
  // booker gets no calendar event rather than an admin's login address.
  bookerOrganizer?: IcsOrganizer;
  ownerOrganizer?: IcsOrganizer;
  businessTz: string;
}

async function loadContext(serviceId: string): Promise<Context> {
  const [companySetting, publicEmail, owners, availability] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    companyEmail(),
    ownerRecipients(),
    db.staffAvailability.findFirst({
      where: { OR: [{ serviceId }, { serviceId: null }] },
      select: { timezone: true },
    }),
  ]);
  const company = companySetting?.value ?? "Akritos";
  const ownerAddress = publicEmail ?? owners[0];
  return {
    company,
    owners,
    bookerOrganizer: publicEmail ? { name: company, email: publicEmail } : undefined,
    ownerOrganizer: ownerAddress ? { name: company, email: ownerAddress } : undefined,
    businessTz: availability?.timezone || "America/New_York",
  };
}

// One UID per appointment so the later CANCEL removes the same calendar entry.
function calendar(appointment: Appointment, fields: Pick<IcsEvent, "method" | "summary" | "description" | "organizer">) {
  return {
    method: fields.method,
    content: buildIcs({
      uid: `${appointment.id}@${new URL(baseUrl()).host}`,
      start: appointment.startsAt,
      end: appointment.endsAt,
      stamp: new Date(),
      ...fields,
    }),
  };
}

function ownerMessage(n: OwnerNotification) {
  return { html: ownerNotificationHtml(n), text: ownerNotificationText(n) };
}

function bookerRows(appointment: Appointment, service: Service, ctx: Context): OwnerNotification["rows"] {
  return [
    ["When", formatInTz(appointment.startsAt, ctx.businessTz)],
    ["Service", `${service.name} (${service.duration} min)`],
    ["Name", appointment.bookerName],
    ["Email", appointment.bookerEmail],
    ["Phone", appointment.bookerPhone],
    ["Notes", appointment.notes],
    ["Booker's timezone", appointment.timezone === ctx.businessTz ? null : appointment.timezone],
  ];
}

// Each email is isolated: a failure — including a synchronous throw while
// building it — is logged with the appointment id and never blocks the other.
async function settle(appointmentId: string, sends: Record<string, () => Promise<void>>): Promise<void> {
  const labels = Object.keys(sends);
  const results = await Promise.allSettled(labels.map(async (label) => sends[label]!()));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const message = r.reason instanceof Error ? r.reason.message : String(r.reason);
      console.error(`[booking] ${labels[i]} email failed for appointment ${appointmentId}: ${message}`);
    }
  });
}

export async function sendBookingEmails(appointment: Appointment, service: Service): Promise<void> {
  const ctx = await loadContext(service.id);
  const cancelUrl = appointmentCancelUrl(appointment.cancelToken);
  const data = {
    serviceName: service.name,
    bookerName: appointment.bookerName,
    startsAt: appointment.startsAt,
    duration: service.duration,
    timezone: appointment.timezone,
    cancelUrl,
    companyName: ctx.company,
    notes: appointment.notes,
  };

  await settle(appointment.id, {
    booker: () =>
      sendEmail({
        to: appointment.bookerEmail,
        subject: `Appointment confirmed — ${service.name}`,
        html: appointmentConfirmationHtml(data),
        text: appointmentConfirmationText(data),
        ...(ctx.bookerOrganizer && {
          icalEvent: calendar(appointment, {
            method: "PUBLISH",
            summary: `${service.name} with ${ctx.company}`,
            description: `To cancel, use this link (deleting the calendar event doesn't cancel): ${cancelUrl}`,
            organizer: ctx.bookerOrganizer,
          }),
        }),
      }),
    owner: () =>
      notifyOwner(
        {
          subject: `New booking: ${service.name} — ${appointment.bookerName}, ${formatInTz(appointment.startsAt, ctx.businessTz)}`,
          replyTo: appointment.bookerEmail,
          ...ownerMessage({
            heading: "New booking",
            rows: bookerRows(appointment, service, ctx),
            link: { href: `${baseUrl()}/dashboard/scheduling`, label: "Open scheduling" },
          }),
          icalEvent: calendar(appointment, {
            method: "PUBLISH",
            summary: `${service.name} — ${appointment.bookerName}`,
            description: [appointment.bookerEmail, appointment.bookerPhone, appointment.notes].filter(Boolean).join("\n"),
            organizer: ctx.ownerOrganizer,
          }),
        },
        ctx.owners
      ),
  });
}

export async function sendCancellationEmails(appointment: Appointment, service: Service): Promise<void> {
  const ctx = await loadContext(service.id);
  const data = {
    serviceName: service.name,
    bookerName: appointment.bookerName,
    startsAt: appointment.startsAt,
    timezone: appointment.timezone,
    bookUrl: `${baseUrl()}/book`,
    companyName: ctx.company,
  };

  await settle(appointment.id, {
    booker: () =>
      sendEmail({
        to: appointment.bookerEmail,
        subject: `Appointment cancelled — ${service.name}`,
        html: appointmentCancellationHtml(data),
        text: appointmentCancellationText(data),
        ...(ctx.bookerOrganizer && {
          icalEvent: calendar(appointment, {
            method: "CANCEL",
            summary: `${service.name} with ${ctx.company}`,
            organizer: ctx.bookerOrganizer,
          }),
        }),
      }),
    owner: () =>
      notifyOwner(
        {
          subject: `Cancelled: ${service.name} — ${appointment.bookerName}, ${formatInTz(appointment.startsAt, ctx.businessTz)}`,
          replyTo: appointment.bookerEmail,
          ...ownerMessage({
            heading: "Booking cancelled by the client",
            rows: bookerRows(appointment, service, ctx),
            link: { href: `${baseUrl()}/dashboard/scheduling`, label: "Open scheduling" },
          }),
          icalEvent: calendar(appointment, {
            method: "CANCEL",
            summary: `${service.name} — ${appointment.bookerName}`,
            organizer: ctx.ownerOrganizer,
          }),
        },
        ctx.owners
      ),
  });
}
