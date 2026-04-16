// app/book/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Book a Free Consultation",
  description:
    "Schedule a free, no-obligation consultation. We'll assess your technology, tell you what needs fixing, and give you a clear plan with real numbers.",
  alternates: { canonical: "https://akritos.com/book" },
};

async function getData() {
  const [setting, services] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.service.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { companyName: setting?.value ?? "Akritos", services };
}

export default async function BookPage() {
  const { companyName, services } = await getData();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Booking
          </p>
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-bone">Book a session</h1>
          <p className="mb-10 text-bone/50">
            Choose a service below. No account needed — we&apos;ll send confirmation to your email.
          </p>

          {services.length === 0 ? (
            <div className="border border-bone/10 bg-slate-brand/20 p-12 text-center text-bone/50" style={{ borderRadius: "2px" }}>
              No services available for booking right now. Check back soon.
            </div>
          ) : (
            <div className="grid gap-px bg-bone/5 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/book/${s.slug}`}
                  className="group flex flex-col bg-midnight p-6 transition-colors hover:bg-slate-brand/20"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h2 className="font-medium text-bone">{s.name}</h2>
                    {s.price !== null && (
                      <span className="ml-3 shrink-0 text-sm text-conviction">
                        {formatCurrency(Number(s.price))}
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-bone/50">{s.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-bone/30">
                      <Clock className="h-3.5 w-3.5" />
                      {s.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-conviction group-hover:underline">
                      Book <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
