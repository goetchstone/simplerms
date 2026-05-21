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
  CheckCircle,
  Compass,
  ClipboardCheck,
  Wrench,
  Handshake,
  MonitorSmartphone,
  ShieldAlert,
  Key,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Akritos — Technology Partners. Not Vendors.",
  description:
    "Senior IT thinking for small businesses without a CTO. We help you pick the right technology, set it up correctly, and stay with you when things change. Co-managed, vendor-agnostic, no lock-in. Free 1-hour consultation.",
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

// The four moments a partnership starts. Same gap (no senior IT thinking),
// different points in the buyer's journey.
const partnershipMoments = [
  {
    icon: Compass,
    title: "Strategy & Vision",
    body: "Where the business is going, and what technology has to be in place to get it there. Roadmaps, architecture decisions, build-vs-buy calls.",
    href: "/services",
  },
  {
    icon: ClipboardCheck,
    title: "Vendor Selection & Audit",
    body: "Vet new software before you sign. Audit what you're already paying for. Exit the vendors that aren't earning their keep.",
    href: "/ownership",
  },
  {
    icon: Wrench,
    title: "Setup & Migration",
    body: "Build it right the first time. Whether it's Google Workspace, Apple Business, identity federation, or migrating off something that isn't working.",
    href: "/apple-business",
  },
  {
    icon: Handshake,
    title: "Ongoing Partnership",
    body: "Monthly cadence, weekly cadence, or embedded — whatever your business needs. We stay with you, your team owns the day-to-day, and we back them up.",
    href: "/pricing",
  },
];

// Other specialty areas — present, one click deep.
const specialties = [
  {
    icon: MonitorSmartphone,
    title: "Apple at work",
    body: "Apple Business setup, MDM deployment, Mac fleet management, training your Windows-native IT team on Apple. 20+ years of Apple in production environments.",
    href: "/apple-business",
  },
  {
    icon: ShieldAlert,
    title: "AI Risk & Guardrails",
    body: "Polished AI documents that beat your SME's veto in the conference room. We help you put guardrails on AI without becoming anti-AI.",
    href: "/ai-risk",
  },
  {
    icon: Key,
    title: "Vendor Independence",
    body: "We find what you don't actually own and help you take it back. Free Tech Debt Checklist included with every consultation.",
    href: "/ownership",
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
    body: "Every vendor we recommend, every tool we deploy — you can walk away from any of it, including us. You stay because we earn it, not because we engineered it.",
  },
  {
    heading: "Vendor costs pass through at cost",
    body: "If a vendor charges $4 per device, you pay $4 per device. No markup, no hidden margin, no kickback fund. We show you the vendor invoice.",
  },
];

export default async function HomePage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={localBusinessSchema()} />
      <SiteNav companyName={companyName} />

      {/* Hero — technology partner positioning */}
      <section className="relative flex flex-col items-center px-6 pb-24 pt-32 text-center">
        <LogoMark size={64} color="#C8A96E" className="mb-6" />
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Senior IT Specialists · Technology Partners
        </p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl lg:text-[56px] lg:leading-tight">
          Technology partners.
          <br />
          <span className="text-conviction">Not vendors.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/60">
          Your business runs on a dozen pieces of technology. Most are working.
          Some aren&apos;t. None of them are talking to each other. We&apos;re
          the people who look at all of it — the senior IT thinking you
          can&apos;t justify hiring full-time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book your free hour <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            How we work
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-bone/40">
          {[
            "Published rates — no hidden fees",
            "Vendor costs at cost",
            "No contracts required",
            "Free 1-hour consultation",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-conviction/60" />
              {t}
            </span>
          ))}
        </div>

        <p className="mt-8 text-xs text-bone/25">
          Senior IT specialists · 20+ years in IT · Remote nationwide · In-person in CT, MA, RI, NYC ·{" "}
          <a
            href="https://macadmins.psu.edu/conference/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-bone/40"
          >
            PSU MacAdmins
          </a>
          {" "}presenter · Fully insured ·{" "}
          <Link href="/about" className="underline underline-offset-2 hover:text-bone/40">
            About us
          </Link>
        </p>
      </section>

      {/* Origin Story — the brand anchor */}
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

      {/* The Gap — what we actually do */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              The Gap We Fill
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Four ways most partnerships start
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Pick the one that matches where you are. Most engagements end up
              covering more than one — the work is connected, the way your
              business is connected.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-2 lg:grid-cols-4">
            {partnershipMoments.map((s) => {
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
        </div>
      </section>

      {/* Brand-level statement */}
      <section className="border-y border-conviction/20 bg-slate-brand/20 px-6 py-20">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-medium leading-relaxed text-bone sm:text-3xl">
            &ldquo;We don&apos;t profit from your confusion.
            We profit when you choose to keep us.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Values */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              How we work
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

      {/* Specialty areas — present, one click deep */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Specialty Areas
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Deep expertise inside the partnership
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Three areas where we go deeper than typical IT consultancies.
              They show up inside most engagements — but you can engage on any
              of them standalone.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-3">
            {specialties.map((s) => {
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
        </div>
      </section>

      {/* Day One */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Day one
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              What you get before you pay a dime
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Your first consultation is free — a full hour. Here&apos;s what
              you walk away with, even if you never hire us.
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
                body: "Are you overpaying? Locked in? We tell you what your current vendors are actually charging vs. market rate.",
              },
              {
                title: "Risk snapshot",
                body: "Security gaps, single points of failure, vendor lock-in. The things that keep you up at night — or should.",
              },
              {
                title: "No obligation",
                body: "Take the plan and do it yourself, hire someone else, or hire us. No guilt, no pressure, no follow-up sales sequence.",
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

      {/* Pricing teaser */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Fair pricing
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Priced for accessibility.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
            Project work from $1,500 flat. Partnership retainers from $750 a
            month. Advisory hourly at $250. Vendor costs pass through at cost.
            Published rates, every line item visible on your invoice. We&apos;d
            rather help a small business succeed than be the firm they
            couldn&apos;t afford.
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
          <h2 className="text-2xl font-medium text-bone">Ready to talk?</h2>
          <p className="mt-4 text-bone/60">
            Free one-hour consultation. We&apos;ll walk your environment with
            you, tell you what we see, what it would cost to fix, and whether
            we&apos;re the right fit. No sales pitch. No obligation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              Book your free hour <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
