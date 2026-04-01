// app/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, CalendarDays, MessageSquare, FileText, ShieldCheck } from "lucide-react";

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const features = [
  {
    icon: CalendarDays,
    title: "Book a session",
    body: "Schedule time with our team directly — no phone tag, no back-and-forth. Pick a slot that works for you.",
    href: "/book",
    cta: "See availability",
  },
  {
    icon: MessageSquare,
    title: "Get support",
    body: "Have a question or issue? Submit a ticket and we'll get back to you promptly. Track your ticket status without creating an account.",
    href: "/support",
    cta: "Open a ticket",
  },
  {
    icon: FileText,
    title: "Client portal",
    body: "View invoices, approve estimates, and pay online — all in one place, no account needed.",
    href: "/portal",
    cta: "Go to portal",
  },
  {
    icon: ShieldCheck,
    title: "Our promise",
    body: "We publish our rates. We don't upsell. We pay every team member a living wage. Take it or leave it — that's how we work.",
    href: "#values",
    cta: "Our values",
  },
];

const values = [
  {
    heading: "People over profit",
    body: "Every person on our team earns a living wage. A business that can't pay its people fairly isn't a business worth building.",
  },
  {
    heading: "Radical honesty",
    body: "We tell you what's broken, what it costs, and why. We'd rather lose a sale than mislead a client.",
  },
  {
    heading: "Equals, not hierarchy",
    body: "We don't have a pecking order. Every voice shapes how we work. The best idea wins — regardless of who has it.",
  },
  {
    heading: "No compromise on quality",
    body: "We'd rather turn down work than do it badly. We build things that last and stand behind everything we deliver.",
  },
];

export default async function HomePage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Consultancy services
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          {companyName}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
          Expert consultancy built on honesty, integrity, and respect — for our clients and our team.
          No lock-in. No hidden fees. Just good work.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Book a session <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Get support
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            How we work with you
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm"
                >
                  <Icon className="mb-4 h-6 w-6 text-zinc-400" strokeWidth={1.5} />
                  <h3 className="mb-2 font-semibold text-zinc-900">{f.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-500">{f.body}</p>
                  <Link
                    href={f.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
                  >
                    {f.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            What we stand for
          </h2>
          <p className="mb-12 text-center text-zinc-500">
            These aren't marketing words. They're how we make decisions, every day.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.heading} className="space-y-2">
                <h3 className="font-semibold text-zinc-900">{v.heading}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-100 bg-zinc-900 px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-white">Ready to work together?</h2>
        <p className="mb-8 text-zinc-400">
          Book a free initial consultation. No obligation, no sales pitch.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Book a free consultation <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
