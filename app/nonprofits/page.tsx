// app/nonprofits/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Nonprofits",
  description:
    "Reduced-rate Apple Business, MDM, and Google Workspace setup for nonprofits and community organizations in CT, MA, and RI. Same standards, honest pricing, you own everything.",
  alternates: { canonical: "https://akritos.com/nonprofits" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const painPoints = [
  {
    heading: "A board member is making tech decisions",
    body: "Someone who volunteers 5 hours a month is choosing your email provider, your donor database, and your security posture. They mean well. They don't have the context.",
  },
  {
    heading: "Donor data lives in personal accounts",
    body: "Spreadsheets on a volunteer's Google Drive. Contact lists in someone's personal Gmail. When that person leaves, the data walks out with them.",
  },
  {
    heading: "Nobody is managing your devices",
    body: "Aging laptops running outdated operating systems with no encryption, no MDM, no way to wipe them if one disappears. Every one of them has access to donor information.",
  },
  {
    heading: "Your payment processing hasn't been audited",
    body: "You're accepting donations online but nobody has looked at your PCI scope, your processing rates, or whether you're in a broader compliance tier than necessary.",
  },
  {
    heading: "You can't update your own website",
    body: "It was built by a board member's nephew three years ago. Nobody has the credentials. Nobody knows where it's hosted. You're paying for a domain renewal you can't find.",
  },
];

export default async function NonprofitsPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Nonprofits &amp; Community Organizations
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
          You can&apos;t afford to overpay.
          <br />
          <span className="text-conviction">You shouldn&apos;t have to.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          You&apos;re doing real work on a real budget. We offer reduced rates
          because the mission matters — and because we want to earn the
          relationship, not just the invoice.
        </p>
      </section>

      {/* Pain points */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Sound Familiar?
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((p) => (
              <div key={p.heading} className="space-y-2">
                <h2 className="text-base font-medium text-bone">{p.heading}</h2>
                <p className="text-base leading-relaxed text-bone/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-8">
          <div className="text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              What We Offer
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Same services. Same standards. Reduced rate.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              We don&apos;t offer a stripped-down &ldquo;nonprofit tier.&rdquo;
              You get the same Apple Business setup, MDM deployment, Google
              Workspace configuration, and knowledge transfer that our business
              clients get. We just charge less for it because your budget
              requires it and your work deserves it.
            </p>
          </div>
          <div className="space-y-4">
            {[
              "Apple Business Manager and MDM — so your devices are managed and recoverable",
              "Google Workspace — so your org owns its email, files, and contacts",
              "Device management training for your staff or IT volunteer",
              "Payment processing audit — better donation rates, smaller PCI scope",
              "No lock-in, no contracts — month-to-month after onboarding",
              "You own every account, every domain, every credential",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-base text-bone/60">
                <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-8">
          <div className="text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              How It Works
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Start with a conversation
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Tell us about your organization",
                body: "What you do, what technology you're using, what's frustrating. No forms, no intake process — just a conversation.",
              },
              {
                step: "2",
                title: "We assess what you have",
                body: "We look at your current setup — devices, email, accounts, website, payment processing — and give you a plain-English assessment of what's working and what's not.",
              },
              {
                step: "3",
                title: "You decide what to fix first",
                body: "We give you a prioritized plan with real numbers. You pick what matters most to your org right now. No pressure to do everything at once.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-conviction/30 text-sm font-medium text-conviction" style={{ borderRadius: "2px" }}>
                  {s.step}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-bone">{s.title}</h3>
                  <p className="text-base leading-relaxed text-bone/60">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest note */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-base leading-relaxed text-bone/60">
            We won&apos;t work for free — our team earns living wages and
            that&apos;s non-negotiable. But we will find a number that works for
            both of us. If we can&apos;t, we&apos;ll tell you and point you
            somewhere that can help.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Tell us about your organization
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          No pitch, no pressure. We&apos;ll listen to what you&apos;re dealing
          with and tell you honestly whether we can help.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Book a free consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
