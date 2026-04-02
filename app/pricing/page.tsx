// app/pricing/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, faqSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Published rates, no surprises. $175/hr on-demand, $150/hr retainer. Vendor costs pass through at cost — zero markup, ever. No contracts required.",
  alternates: { canonical: "https://akritos.com/pricing" },
};

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const tiers = [
  {
    name: "On-Demand",
    price: "$175",
    unit: "/ hour",
    description: "Expert help when you need it. No contract, no commitment. Call us, we show up.",
    features: [
      "No contract or minimum hours",
      "Remote and on-site support",
      "Hardware and software consulting",
      "Vendor evaluation and negotiation",
      "One-off projects and deployments",
      "Emergency response available",
    ],
    cta: "Book a session",
    href: "/book",
    featured: false,
  },
  {
    name: "Retainer",
    price: "$150",
    unit: "/ hour",
    description: "Monthly block of hours at a reduced rate. Priority response, ongoing relationship. You get a partner who knows your environment.",
    features: [
      "10+ hour monthly block commitment",
      "Priority response — same business day",
      "Ongoing technology oversight",
      "Apple Business & MDM management",
      "Vendor management and negotiations",
      "Quarterly technology reviews",
      "Compliance monitoring (PCI, HIPAA)",
      "Month-to-month after 3-month onboarding",
    ],
    cta: "Book a free consultation",
    href: "/book",
    featured: true,
  },
  {
    name: "Projects",
    price: "Quoted",
    unit: "per scope",
    description: "Migrations, deployments, modernization. We scope it, quote it, and deliver it. Fixed price, no surprises.",
    features: [
      "FileMaker & legacy app modernization",
      "Infrastructure deployments",
      "Office buildouts and AV",
      "MDM rollouts and migrations",
      "Data migration and cleanup",
      "Full documentation and handoff",
    ],
    cta: "Let's scope it",
    href: "/book",
    featured: false,
  },
];

const faqs = [
  {
    q: "Do you mark up vendor costs?",
    a: "No. Vendor costs are pass-through at cost. If Mosyle charges $4/device/month, you pay $4/device/month. If we negotiate a better rate with a vendor, the savings go to you. We show you the vendor invoice — you see exactly what you're paying for.",
  },
  {
    q: "Do you take vendor kickbacks?",
    a: "No. We never accept partnership revenue, referral fees, or volume incentives from vendors we recommend. Our recommendations are based on what's right for you, not what pays us the most.",
  },
  {
    q: "What if I want to leave?",
    a: "You leave. There's no exit fee, no contract penalty, no hostage negotiation. You own everything we built for you. We'll even help with the transition to whoever comes next.",
  },
  {
    q: "What does a typical monthly bill look like?",
    a: "A 25-person company on a 10-hour retainer might see: $1,500 for our time, plus $100 for MDM licensing, plus $125 for endpoint security — all at cost. Total: $1,725. Every line item is visible and verifiable.",
  },
  {
    q: "What if I don't use all my retainer hours?",
    a: "Then you had a good month. Hours don't roll over — but if you're consistently using less, we'll tell you to drop to a smaller block. We'd rather you pay for what you need than carry hours you don't use.",
  },
  {
    q: "Do you charge for initial consultations?",
    a: "No. The first conversation is always free. We'll tell you what we see, what it would cost, and whether we're the right fit. If we're not, we'll tell you that too.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "Retainer plans are month-to-month after a 3-month onboarding period. The onboarding minimum exists because it takes time to learn your environment and do this right. After that, you stay because it works, not because you're trapped.",
  },
];

export default async function PricingPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={faqSchema(faqs)} />
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Pricing
        </p>
        <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
          Published rates. No surprises.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          Our time is billed hourly. Vendor costs are pass-through at cost — no
          markup, ever. You see every line item on every invoice.
        </p>
      </section>

      {/* Tiers */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-[1200px] gap-px bg-bone/5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col p-10 ${
                tier.featured
                  ? "bg-slate-brand/30 ring-1 ring-conviction/30"
                  : "bg-midnight"
              }`}
            >
              {tier.featured && (
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                  Most clients choose this
                </p>
              )}
              <h2 className="text-xl font-medium text-bone">{tier.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-medium text-bone">{tier.price}</span>
                {tier.unit && (
                  <span className="text-sm text-bone/40">{tier.unit}</span>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-bone/50">
                {tier.description}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-bone/60">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-10 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  tier.featured
                    ? "bg-conviction text-midnight hover:bg-conviction/90"
                    : "border border-bone/20 text-bone hover:border-conviction hover:text-conviction"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {tier.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pass-Through Explanation */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-8">
          <div className="text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Radical Transparency
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Your bill, line by line
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
              Most MSPs bundle everything into one per-user fee so you can&apos;t
              see the markup. We do the opposite. Our time is our time. Vendor
              costs are vendor costs. You see both.
            </p>
          </div>
          <div className="space-y-1 border border-bone/10 bg-midnight p-6" style={{ borderRadius: "2px" }}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-bone/30">
              How your invoice looks
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-bone/60">
                <span>Akritos — retainer hours</span>
                <span className="text-bone">Our rate</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>MDM licensing <span className="text-bone/30">(pass-through at cost)</span></span>
                <span className="text-bone">Vendor&apos;s price</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Endpoint security <span className="text-bone/30">(pass-through at cost)</span></span>
                <span className="text-bone">Vendor&apos;s price</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Backup <span className="text-bone/30">(pass-through at cost)</span></span>
                <span className="text-bone">Vendor&apos;s price</span>
              </div>
              <div className="mt-3 border-t border-bone/10 pt-3 text-bone/40 text-xs">
                Every vendor line item links to the vendor&apos;s own invoice.
                We add zero markup. You verify every dollar.
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-bone/40">
            Vendor costs depend on your stack — we recommend the right tools for
            your needs and you pay the vendor directly, or we pass through at
            cost. Either way, no markup.
          </p>
        </div>
      </section>

      {/* What you won't find */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6 text-center">
          <h2 className="text-[28px] font-medium text-bone">
            What you won&apos;t find on our invoice
          </h2>
          <div className="grid gap-6 text-left sm:grid-cols-2">
            {[
              "Vendor markup — ever",
              "Travel fees for local visits",
              "Hidden 'project management' charges",
              "Charges for problems we caused",
              "Emergency surcharges for retainer clients",
              "Exit fees or contract penalties",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-bone/60">
                <span className="mt-0.5 text-conviction">✕</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              The Difference
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Typical MSP vs. Akritos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
              Most managed service providers profit from your dependency. We
              profit from your independence. Here&apos;s what that looks like.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 md:grid-cols-3">
            {/* Header row */}
            <div className="bg-midnight p-5" />
            <div className="bg-midnight p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">
                Typical MSP
              </p>
            </div>
            <div className="bg-slate-brand/30 p-5 text-center ring-1 ring-conviction/20">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                Akritos
              </p>
            </div>
            {/* Rows */}
            {[
              {
                label: "Pricing model",
                them: "Bundled per-user fee",
                us: "Hourly + vendor pass-through at cost",
              },
              {
                label: "Vendor markup",
                them: "20-40% hidden markup",
                us: "Zero. You see the vendor invoice.",
              },
              {
                label: "Contracts",
                them: "12-36 month lock-in",
                us: "Month-to-month after onboarding",
              },
              {
                label: "Vendor kickbacks",
                them: "Partnership revenue, referral fees",
                us: "None. Recommendations based on fit.",
              },
              {
                label: "Data ownership",
                them: "Held in their systems",
                us: "You own everything. Always.",
              },
              {
                label: "Exit process",
                them: "Fees, penalties, delayed handoff",
                us: "Walk away anytime. We help transition.",
              },
            ].flatMap((row) => [
              <div key={`${row.label}-label`} className="flex items-center bg-midnight p-5">
                <p className="text-sm font-medium text-bone">{row.label}</p>
              </div>,
              <div key={`${row.label}-them`} className="flex items-center bg-midnight p-5">
                <p className="flex items-start gap-2 text-sm text-bone/40">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-alert/60" />
                  {row.them}
                </p>
              </div>,
              <div key={`${row.label}-us`} className="flex items-center bg-slate-brand/30 p-5 ring-1 ring-conviction/20">
                <p className="flex items-start gap-2 text-sm text-bone/70">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-conviction" />
                  {row.us}
                </p>
              </div>,
            ])}
          </div>
        </div>
      </section>

      {/* Non-Profits */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Community
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Non-profits and community organizations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
            If you&apos;re a non-profit or community organization doing real
            work, talk to us. We offer reduced rates because the work matters.
            We won&apos;t work for free — our team earns living wages and
            that&apos;s non-negotiable — but we&apos;ll find a number that
            works for both of us.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              Let&apos;s talk about what you need <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[720px]">
          <h2 className="mb-4 text-center text-[28px] font-medium text-bone">
            Common questions
          </h2>
          <p className="mb-12 text-center text-sm text-bone/40">
            Have a question not listed here? Call{" "}
            <a href="tel:+18609343410" className="text-conviction underline underline-offset-2">
              (860) 934-3410
            </a>{" "}
            or email{" "}
            <a href="mailto:gstone@akritos.com" className="text-conviction underline underline-offset-2">
              gstone@akritos.com
            </a>
          </p>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="space-y-2">
                <h3 className="text-sm font-medium text-bone">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-bone/50">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">No obligation. No sales pitch.</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/50">
          Book a free consultation. We&apos;ll tell you what we see and what it
          would cost. If we&apos;re not the right fit, we&apos;ll tell you that too.
        </p>
        <div className="mt-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
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
