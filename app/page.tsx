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
  Laptop,
  CreditCard,
  Globe,
  GraduationCap,
  Crown,
  CheckCircle,
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
    icon: MonitorSmartphone,
    title: "Apple Business Setup",
    body: "Apple Business Manager, managed Apple IDs, Automated Device Enrollment, identity federation. The foundation everything else builds on. We handle registration through deployment.",
  },
  {
    icon: Laptop,
    title: "MDM Setup & Migration",
    body: "Mosyle, Jamf, Iru, Addigy — chosen for fit, not kickbacks. Already running Intune? Keep it for Windows. We deploy Apple MDM alongside it.",
  },
  {
    icon: Globe,
    title: "Google Workspace Setup",
    body: "Domain, email, SSO, identity federation with Apple Business Manager. SPF, DKIM, DMARC. You own the domain, you own the accounts, you hold the keys.",
  },
  {
    icon: GraduationCap,
    title: "Mac Training for Windows Teams",
    body: "Your IT team knows Windows. We teach them Apple. MDM vs. Group Policy, Apple IDs vs. AD, the whole mental model shift. We set it up, train your people, you own it.",
  },
  {
    icon: CreditCard,
    title: "PCI & Payment Processing",
    body: "Better card rates, smaller PCI compliance surface. Most businesses are in a broader scope than necessary and paying more than they should. We fix both.",
  },
  {
    icon: Crown,
    title: "Executive IT",
    body: "C-suite runs on Apple. Home office, devices, network, security — discreet, thorough, and available when they need it. Not when the help desk gets around to it.",
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
          Your business is living in confusion.
          <br />
          <span className="text-conviction">We end it.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/60">
          Your IT team knows Windows. Then the company buys Macs and everything
          they know stops applying. We set up Apple Business, deploy the right
          MDM, configure Google Workspace, and train your team to own it
          all — and you can run it without us. Most clients don&apos;t
          want to, and that&apos;s the point.
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
          Founded by{" "}
          <Link href="/about" className="underline underline-offset-2 hover:text-bone/40">
            Goetch Stone
          </Link>
          {" "}· 20+ years in IT · Based in Connecticut ·{" "}
          <a
            href="https://macadmins.psu.edu/conference/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-bone/40"
          >
            PSU MacAdmins
          </a>
          {" "}workshop instructor
        </p>
      </section>

      {/* Origin Story */}
      <section className="border-t border-bone/10 bg-slate-brand/30 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            The Name
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Akritos means unsure.
          </h2>
          <p className="text-base leading-relaxed text-bone/60">
            From the Ancient Greek <em>akritos</em> — unsure, undecided,
            indiscriminate. When we asked AI what it meant, it said
            &ldquo;uncompromising.&rdquo; We liked the sound of it and ran
            with the name. Then we looked it up ourselves.
          </p>
          <p className="text-base leading-relaxed text-bone/60">
            Turns out the real meaning was better. Because that&apos;s exactly
            what our clients are before they find us — unsure, locked in,
            overwhelmed, dependent on vendors who profit from that uncertainty.
            <em>Akritos</em> isn&apos;t what we are. It&apos;s what we fix.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              What We Do
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Apple device management, done right and handed off
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              We set up Apple Business, deploy MDM, configure Google Workspace,
              and train your Windows-native IT team to run it all. Then we
              stay because you want us to, not because you have to.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-midnight p-8 transition-colors hover:bg-slate-brand/20"
                >
                  <Icon className="mb-4 h-5 w-5 text-conviction" strokeWidth={1.5} />
                  <h3 className="mb-2 text-base font-medium text-bone">{s.title}</h3>
                  <p className="text-base leading-relaxed text-bone/60">{s.body}</p>
                </div>
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
            We profit from your trust.&rdquo;
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

      {/* Testimonials — earned, not invented */}
      <section className="border-t border-bone/10 px-6 py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-base leading-relaxed text-bone/30">
            We&apos;re new. Testimonials are earned, not invented.
            When we have them, they&apos;ll be here — with real names
            and real numbers.
          </p>
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
