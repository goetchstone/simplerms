// app/support/track/page.tsx
export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrackReplyForm } from "@/components/tickets/track-reply-form";

export const metadata = {
  title: "Track Ticket",
  description: "View your support ticket status and conversation history.",
  robots: "noindex, nofollow",
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function TrackPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) notFound();

  const ticket = await db.ticket.findUnique({
    where: { publicToken: token },
    include: {
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) notFound();

  const companyName = await getCompanyName();
  const isResolved = ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Ticket {ticket.ticketNumber}
          </p>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-medium tracking-tight text-bone">
              {ticket.subject}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="mb-8 text-sm text-bone/40">
            Submitted {ticket.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {ticket.submitterName ? ` by ${ticket.submitterName}` : ""}
          </p>

          {/* Message thread */}
          <div className="mb-8 space-y-4">
            {ticket.messages.map((msg) => {
              const isStaff = !!msg.senderId;
              return (
                <div
                  key={msg.id}
                  className="border border-bone/10 p-5"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-bone/80">
                      {isStaff ? (msg.senderName ?? "Support") : (ticket.submitterName ?? "You")}
                    </span>
                    <span className="text-xs text-bone/30">
                      {msg.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-bone/60">
                    {msg.body}
                  </p>
                </div>
              );
            })}

            {ticket.messages.length === 0 && (
              <div
                className="border border-bone/10 p-8 text-center"
                style={{ borderRadius: "2px" }}
              >
                <p className="text-sm text-bone/40">No messages yet. We&apos;ll respond shortly.</p>
              </div>
            )}
          </div>

          {/* Reply form — hidden for resolved/closed tickets */}
          {!isResolved ? (
            <TrackReplyForm token={token} />
          ) : (
            <div
              className="border border-bone/10 p-6 text-center"
              style={{ borderRadius: "2px" }}
            >
              <p className="text-sm text-bone/40">
                This ticket has been {ticket.status.toLowerCase()}. Need more help?{" "}
                <a href="/support" className="text-conviction underline">
                  Submit a new ticket
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
