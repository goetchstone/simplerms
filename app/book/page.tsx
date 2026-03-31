// app/book/page.tsx
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Book a session | SimpleRMS",
  description: "Choose a service and pick a time that works for you.",
};

async function getData() {
  const [setting, services] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.service.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { companyName: setting?.value ?? "SimpleRMS", services };
}

export default async function BookPage() {
  const { companyName, services } = await getData();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-3xl">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">Book a session</h1>
          <p className="mb-10 text-zinc-500">
            Choose a service below. No account needed — we'll send confirmation to your email.
          </p>

          {services.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center text-zinc-500">
              No services available for booking right now. Check back soon.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/book/${s.slug}`}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 hover:shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h2 className="font-semibold text-zinc-900">{s.name}</h2>
                    {s.price !== null && (
                      <span className="ml-3 shrink-0 text-sm font-medium text-zinc-500">
                        {formatCurrency(Number(s.price), "CAD")}
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-500">{s.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {s.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-zinc-900 group-hover:underline">
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
