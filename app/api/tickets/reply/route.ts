// app/api/tickets/reply/route.ts
// Public endpoint for ticket submitters to reply via the tracking page.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { rateLimit } from "@/server/rate-limit";
import { sendEmail } from "@/server/email";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`ticket-reply:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { token?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const token = body.token?.trim();
  const messageBody = body.body?.trim();

  if (!token || !messageBody) {
    return NextResponse.json({ error: "Token and message body are required" }, { status: 400 });
  }

  if (messageBody.length > 10_000) {
    return NextResponse.json({ error: "Message is too long (10,000 character limit)" }, { status: 400 });
  }

  const ticket = await db.ticket.findUnique({
    where: { publicToken: token },
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      status: true,
      submitterName: true,
      submitterEmail: true,
      assignedToId: true,
      assignedTo: { select: { email: true } },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
    return NextResponse.json({ error: "This ticket is closed" }, { status: 400 });
  }

  // Create the message and reopen ticket if it was waiting on client.
  await db.$transaction(async (tx) => {
    await tx.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderName: ticket.submitterName ?? "Submitter",
        body: messageBody,
        isInternal: false,
      },
    });

    if (ticket.status === "WAITING_ON_CLIENT") {
      await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: "OPEN" },
      });
    }
  });

  // Notify assigned staff member (or skip if unassigned).
  if (ticket.assignedTo?.email) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/tickets/${ticket.id}`;
    const textBody = [
      `${ticket.submitterName ?? "The submitter"} replied to ticket ${ticket.ticketNumber}:`,
      "",
      messageBody,
      "",
      `View in dashboard: ${dashboardUrl}`,
    ].join("\n");

    sendEmail({
      to: ticket.assignedTo.email,
      subject: `[${ticket.ticketNumber}] Client replied: ${ticket.subject}`,
      html: `<p>${textBody.replace(/\n/g, "<br />")}</p>`,
      text: textBody,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
