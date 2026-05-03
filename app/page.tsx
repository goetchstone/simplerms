// app/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { LogoMark } from "@/components/brand/logo-mark";
import { JsonLd, localBusinessSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import {
  ArrowRight,
  MonitorSmartphone,
  GraduationCap,
  CheckCircle,
  Key,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Akritos — Apple MDM & Mac Management for Business",
  description:
    "Apple Business setup, MDM deployment, Google Workspace, and Mac management training for Windows-native IT teams. Published rates, zero vendor markup, no lock-in. Free consultation.",
  alternates: { canonical: "https://akritos.com" },
};

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const services = [
  {
    icon: Key,
    title: "Vendor Independence Audit",
    body: "Find out what you don't actually own. Get a written plan to take it back. Yours to keep, whether you hire us or not.",
    href: "/ownership",
  },
  {
    icon: MonitorSmartphone,
    title: "Apple Business Setup",
    body: "Apple's free all-in-one platform for device management, email, and local presence. For most small businesses, it's all the IT you need.",
    href: "/apple-business",
  },
  {
    icon: GraduationCap,
    title: "Mac Training for Windows Teams",
    body: "Internal IT knows Windows. We teach them Apple. MDM vs. Group Policy, Apple IDs vs. AD — your team operates the stack independently.",
    href: "/services",
  },
  {
    icon: ShieldAlert,
    title: "AI Risk & Guardrails",
    body: "Polished AI documents that beat your SME's veto in the conference room. We help you put guardrails on AI use without becoming anti-AI.",
    href: "/ai-risk",
  },
];

const values = [
  {
    heading: "You own your technology",
    body: "No lock-in. Ever. If we disappeared tomorrow, you'd still have everything. Your domains, your accounts, your infrastructure — yours.",
  },
  {
    heading: "We tell you the truth",
    body: "If you're about to make a bad decision, we'll say so. We'd rather lose the engagement than let you walk into something you'll regret.",
  },
  {
    heading: "Everything is divorceable",
    body: "Every vendor we recommend, every tool we deploy, every partnership we build — you can walk away from any of it, including us. You stay because we earn it, not because we engineered it.",
  },
  {
    heading: "The P is Partner",
    body: "We're not a managed service provider. We're a managed service partner. Providers extract value. Partners create it. The distinction matters to us.",
  },
];

export default async function HomePage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={localBusinessSchema()} />
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pb-24 pt-32 text-center">
        <LogoMark size={64} color="#C8A96E" className="mb-6" />
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Technology Partners
        </p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl lg:text-[56px] lg:leading-tight">
          The keys to your business
          <br />
          <span className="text-conviction">shouldn&apos;t be in someone else&apos;s pocket.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/60">
          Most owners don&apos;t know what keys they&apos;re missing — or what
          to call the ones they have. That&apos;s normal, not a failure. We
          figure out what&apos;s yours, what isn&apos;t, and what&apos;s in
          someone else&apos;s account. Then we get it all in your name and
          translate the technical stuff so you actually understand what
          you own.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book a free consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            View services
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-bone/40">
          {[
            "Published rates — no hidden fees",
            "Zero vendor markup",
            "No contracts required",
            "Free initial consultation",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-conviction/60" />
              {t}
            </span>
          ))}
        </div>

        <p className="mt-8 text-xs text-bone/25">
          20+ years in IT · Remote nationwide · In-person in CT, MA, RI, NYC ·{" "}
          <a
            href="https://macadmins.psu.edu/conference/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-bone/40"
          >
            PSU MacAdmins
          </a>
          {" "}workshop instructor · Fully insured ·{" "}
          <Link href="/about" className="underline underline-offset-2 hover:text-bone/40">
            About us
          </Link>
        </p>
      </section>

      {/* Origin Story */}
      <section className="border-t border-bone/10 bg-slate-brand/30 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            The Name
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Akritos means unwatered.
          </h2>
          <p className="text-base leading-relaxed text-bone/60">
            From the Ancient Greek <em>ἄκριτος</em>. The Greeks
            watered down their wine. Akritos wine was full
            strength — uncut, undiluted, the real thing.
          </p>
          <p className="text-base leading-relaxed text-bone/60">
            Most IT consulting is watered down. Padded hours.
            Unnecessary recommendations. Vendor kickbacks baked
            into the price. We don&apos;t do any of that.
            Full strength, or we don&apos;t show up.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Where Do You Need Help?
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Four ways to take ownership back
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Whether you came in with a specific problem or just know
              something feels off, here are the four most common starting
              points.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group bg-midnight p-8 transition-colors hover:bg-slate-brand/20"
                >
                  <Icon className="mb-4 h-5 w-5 text-conviction" strokeWidth={1.5} />
                  <h3 className="mb-2 text-base font-medium text-bone">{s.title}</h3>
                  <p className="text-base leading-relaxed text-bone/60">{s.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-conviction group-hover:gap-2 transition-[gap]">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-conviction hover:text-conviction/80"
            >
              See all services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Break */}
      <section className="border-y border-conviction/20 bg-slate-brand/20 px-6 py-20">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-medium leading-relaxed text-bone sm:text-3xl">
            &ldquo;We don&apos;t profit from your confusion.
            We profit when you choose to keep us.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-bone/30">
            — Goetch Stone, Founder
          </footer>
        </blockquote>
      </section>

      {/* Values */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              How We Work
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              These aren&apos;t marketing words
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              They&apos;re the rules we make every decision by. We publish them
              because you should be able to hold us to them.
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.heading} className="space-y-3 border-l-2 border-conviction/30 pl-6">
                <h3 className="text-base font-medium text-bone">{v.heading}</h3>
                <p className="text-base leading-relaxed text-bone/60">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Day One
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              What you get before you pay a dime
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Your first consultation is free. Here&apos;s what you walk away with —
              even if you never hire us.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Honest assessment",
                body: "What's working, what's broken, and what's costing you money. No sugarcoating.",
              },
              {
                title: "Clear plan with real numbers",
                body: "Exactly what needs to happen, in what order, and what it costs. Our rate and vendor costs, separated.",
              },
              {
                title: "Vendor audit",
                body: "Are you overpaying? Are you locked in? We'll tell you what your current vendors are actually charging vs. market rate.",
              },
              {
                title: "Risk snapshot",
                body: "Security gaps, single points of failure, vendor lock-in. The things that keep you up at night — or should.",
              },
              {
                title: "No obligation",
                body: "Take the plan and do it yourself, hire someone else, or hire us. No guilt, no pressure, no follow-up sales calls.",
              },
              {
                title: "Written summary",
                body: "Everything we discussed, documented and emailed to you. Not a sales deck — a working document you can act on.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="text-base font-medium text-bone">{item.title}</h3>
                <p className="text-base leading-relaxed text-bone/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Fair Pricing
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Published rates. No surprises.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
            We believe you should know what something costs before you commit.
            Our rates are public, our invoices are clear, and we don&apos;t
            bill for problems we created.
          </p>
          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-medium text-bone">Ready to end the confusion?</h2>
          <p className="mt-4 text-bone/60">
            Book a free initial consultation. We&apos;ll tell you what we see,
            what it would cost to fix, and whether we&apos;re the right fit.
            No sales pitch. No obligation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              Book a free consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              Open a support ticket
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
