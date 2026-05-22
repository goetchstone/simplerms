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
  title: "Pricing — Akritos",
  description:
    "Published rates for senior IT partnership. Free 1-hour consultation. Project work from $1,500 flat. Partnership retainers from $750/month. Advisory at $250/hr. Vendor costs pass through at cost — zero markup.",
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

interface Tier {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  examples: { label: string; range: string }[] | null;
  cta: string;
  href: string;
  featured: boolean;
}

const tiers: Tier[] = [
  {
    name: "The Free Hour",
    price: "$0",
    unit: "",
    description:
      "Your first conversation, free. 60 minutes walking your environment together. We bring the Tech Debt Checklist. You leave with it filled in — honest assessment, real numbers, written summary. Yours either way.",
    features: [
      "Full 60-minute conversation",
      "Tech Debt Checklist filled in with you",
      "Honest assessment of what's working and what isn't",
      "Real numbers on what fixes would cost",
      "Written summary emailed afterward",
      "No obligation, no follow-up sales sequence",
    ],
    examples: null,
    cta: "Book your free hour",
    href: "/book",
    featured: false,
  },
  {
    name: "Project Work",
    price: "From $1,500",
    unit: "flat",
    description:
      "Specific, scoped work with a defined deliverable. Quoted as a flat number after the free hour — no hourly stretch, no surprise invoices. Most clients start here, then move into partnership if it makes sense.",
    features: [
      "Scoped after the free hour",
      "Flat fee, no hourly stretch",
      "Defined deliverable and timeline",
      "Documentation you own",
      "Vendor costs pass through at cost",
      "No retainer required",
    ],
    examples: [
      { label: "Quick win — fix the most painful thing", range: "$1,500 – $3,500" },
      { label: "Standard setup — build it right", range: "$3,000 – $5,500" },
      { label: "Complex / multi-system migration", range: "$5,500 – $15,000+" },
    ],
    cta: "Book your free hour",
    href: "/book",
    featured: true,
  },
  {
    name: "Partnership Retainer",
    price: "From $750",
    unit: "/ month",
    description:
      "Ongoing technology partnership at the cadence your business needs. We're your senior IT thinking. Your team owns day-to-day; we own the bigger picture and back them up. Month-to-month after a 3-month onboarding.",
    features: [
      "Senior IT thinking on retainer",
      "Vendor management and strategic guidance",
      "Quarterly environment reviews",
      "Escalation backup for your team",
      "Priority response",
      "Month-to-month after onboarding",
      "No exit fees, no penalties",
    ],
    examples: [
      { label: "Light Touch — ~6 hrs/mo, monthly cadence", range: "$750 /mo" },
      { label: "Standard — ~18 hrs/mo, weekly cadence", range: "$3,500 /mo" },
      { label: "Deep Partnership — ~35 hrs/mo, embedded", range: "$7,500 /mo" },
    ],
    cta: "Book your free hour",
    href: "/book",
    featured: false,
  },
  {
    name: "Advisory Hourly",
    price: "$250",
    unit: "/ hour",
    description:
      "Ad-hoc work outside a retainer. One-off questions, specific projects, things that don't justify ongoing partnership. Senior-level expertise when you need it, no commitment required.",
    features: [
      "No contract or minimum hours",
      "Payment processor rate negotiation",
      "PCI scope assessment and reduction",
      "Vendor audit and exit planning",
      "Contract review and negotiation",
      "Architecture and infrastructure planning",
      "Remote delivery nationwide",
    ],
    examples: null,
    cta: "Book your free hour",
    href: "/book",
    featured: false,
  },
];

const faqs = [
  {
    q: "Why no per-user pricing?",
    a: "Per-user pricing is the MSP model — it commoditizes the relationship and bundles your fee with vendor costs you can't see. We price for the work. Project work is flat-fee. Partnership is a retainer based on what your business actually needs, not how many seats you have. Vendor costs pass through at cost, on a separate line, so you always know what you're paying for.",
  },
  {
    q: "Do you mark up vendor costs?",
    a: "No. Vendor costs are pass-through at cost. If a vendor charges $4 per device, you pay $4 per device. If we negotiate a better rate with a vendor, the savings go to you. We show you the vendor invoice — you see exactly what you're paying for.",
  },
  {
    q: "Do you take vendor kickbacks?",
    a: "No. We never accept partnership revenue, referral fees, or volume incentives from vendors we recommend. Our recommendations are based on what's right for you, not what pays us the most.",
  },
  {
    q: "What's the difference between project work and a partnership retainer?",
    a: "Project work is a specific, scoped engagement with a defined deliverable — set up the environment, migrate off Intune, audit your vendors, build a custom tool. Flat fee, no recurring commitment. A partnership retainer is ongoing — we're your senior IT thinking month after month, helping you make strategic decisions, vetting new vendors, backing up your team when something complicated comes up. Most clients start with project work and add a retainer once they see the value.",
  },
  {
    q: "What does Light Touch retainer actually include?",
    a: "About 6 hours per month of senior IT time, a monthly check-in, ad-hoc questions you can email or call about, and being on retainer so we know your environment when something does come up. For solo professionals and small businesses where you don't need constant attention but you want a real partner you can call. Overages are billed at the regular hourly rate so there are no surprises.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "Partnership retainers are month-to-month after a 3-month onboarding. The onboarding minimum exists because it takes time to learn your environment well enough to be useful. After that, you stay because it's working, not because you're trapped.",
  },
  {
    q: "What if my budget can't reach the lowest tier?",
    a: "Tell us. If your work matters to your community — non-profits, mission-driven small businesses, community organizations — we'll find a number that works for both of us. We'd rather help a small business succeed than be the firm they couldn't afford. We won't work for free (our team earns living wages and that's non-negotiable), but we'll be reasonable.",
  },
  {
    q: "What does a typical monthly invoice look like?",
    a: "A 15-person company on the Standard retainer: $3,500 for partnership, plus any vendor costs pass-through (Google Workspace, Apple Business is free, MDM if applicable, etc.) listed line by line. If you used 5 advisory hours that month outside the retainer, that's $1,250 extra. Every line visible and verifiable.",
  },
  {
    q: "Why no RMM agents?",
    a: "RMM (remote monitoring and management) tools are installed on every device and have deep system access — which makes them a prime target for attackers. We manage through MDM when devices are managed at all, which is already on Apple devices by design. One less agent, one less attack surface.",
  },
  {
    q: "What if I want to leave?",
    a: "You leave. There's no exit fee, no contract penalty, no hostage negotiation. You own everything we built for you. We'll even help with the transition to whoever comes next.",
  },
  {
    q: "Do you replace our IT team?",
    a: "No. We work with them. Most of our clients have either no internal IT or a small team that lacks the senior thinking layer. We're the strategic / architectural / vendor-management partner — your team handles day-to-day operations. We make sure they have what they need to succeed.",
  },
  {
    q: "We already use Microsoft 365 / Google Workspace. Do we need to change?",
    a: "Probably not. We're vendor-agnostic. Tell us what you're already running and we'll work inside it. We're Google Workspace specialists but we work alongside Microsoft 365 environments routinely. Choosing the platform is part of the partnership conversation if you're starting fresh — but we don't migrate businesses just to migrate them.",
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
          Project work is flat-fee, scoped after the free hour. Partnerships
          are retained at the cadence your business needs. Advisory is hourly,
          no commitment. Vendor costs pass through at cost — zero markup, ever.
        </p>
        <div className="mt-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book your free hour <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Accessibility philosophy */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Our Pricing Philosophy
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Priced for accessibility.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-bone/60">
            We&apos;re not the cheapest option. We&apos;re also not the most
            expensive. We deliberately sit at the bottom of the market median
            for senior IT partnership because we&apos;d rather help a small
            business succeed than be the firm they couldn&apos;t afford.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-bone/60">
            If our pricing is still a barrier and your work matters to your
            community, tell us. We&apos;ll find a number that works for both of
            us.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm text-bone/40">
            <Link
              href="/blog/the-600-bar-of-soap"
              className="text-conviction underline underline-offset-2 hover:text-conviction/80"
            >
              The story behind why we price this way →
            </Link>
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-bone/5 md:grid-cols-2 xl:grid-cols-4">
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
                  Where most engagements start
                </p>
              )}
              <h2 className="text-xl font-medium text-bone">{tier.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-medium text-bone">{tier.price}</span>
                {tier.unit && (
                  <span className="text-sm text-bone/40">{tier.unit}</span>
                )}
              </div>
              <p className="mt-4 text-base leading-relaxed text-bone/60">
                {tier.description}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-base text-bone/60">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                    {f}
                  </li>
                ))}
              </ul>

              {tier.examples && (
                <div className="mt-8 space-y-2 border-t border-bone/10 pt-6">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/30">
                    Typical ranges
                  </p>
                  {tier.examples.map((ex) => (
                    <div key={ex.label} className="flex justify-between text-xs">
                      <span className="text-bone/40">{ex.label}</span>
                      <span className="text-bone/60">{ex.range}</span>
                    </div>
                  ))}
                </div>
              )}

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
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
              Most MSPs bundle everything into one per-user fee so you
              can&apos;t see the markup. We do the opposite. Our fee is our
              fee. Vendor costs are vendor costs. You see both.
            </p>
          </div>
          <div className="space-y-1 border border-bone/10 bg-midnight p-6" style={{ borderRadius: "2px" }}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-bone/30">
              Sample monthly invoice — 15-person business on Standard retainer
            </p>
            <div className="space-y-2 text-base">
              <div className="flex justify-between text-bone/60">
                <span>Standard Partnership Retainer</span>
                <span className="text-bone">$3,500.00</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Apple Business license <span className="text-bone/30">(free from Apple)</span></span>
                <span className="text-bone">$0.00</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Google Workspace — 15 users × $14 <span className="text-bone/30">(at cost, billed directly to you)</span></span>
                <span className="text-bone">$210.00</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Advisory — overage hours outside retainer, 3 hrs × $250</span>
                <span className="text-bone">$750.00</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-bone/10 pt-3 font-medium">
                <span className="text-bone/60">Total to Akritos</span>
                <span className="text-bone">$4,250.00</span>
              </div>
              <div className="pt-2 text-bone/30 text-xs">
                Google Workspace ($210) bills directly from Google — never from us. Zero markup. You see every vendor invoice.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page consult CTA */}
      <section className="border-t border-bone/10 px-6 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Not Sure Which Fits?
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Tell us about your setup.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
            One free hour, and you walk away with a real plan — even if you
            never hire us. We&apos;ll tell you what we see, what the right
            engagement would look like, and whether you need us at all.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              Book your free hour <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
              "Per-user fees bundling our work with vendor costs",
              "RMM agent fees or monitoring charges",
              "Hidden 'project management' charges",
              "Charges for problems we caused",
              "Exit fees or contract penalties",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-base text-bone/60">
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
          </div>
          <div className="grid gap-px bg-bone/5 md:grid-cols-3">
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
            {[
              {
                label: "Pricing model",
                them: "Bundled per-user fee hiding markup",
                us: "Project flat-fee or retainer + vendor pass-through",
              },
              {
                label: "Vendor markup",
                them: "20-40% hidden markup",
                us: "Zero. You see the vendor invoice.",
              },
              {
                label: "Strategic thinking",
                them: "Help desk model, ticket-driven",
                us: "Senior IT partnership, proactive",
              },
              {
                label: "Monitoring",
                them: "RMM agents on every device",
                us: "MDM-native. No extra agents or attack surface.",
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
                label: "Exit process",
                them: "Fees, penalties, delayed handoff",
                us: "Walk away anytime. We help transition.",
              },
            ].flatMap((row) => [
              <div key={`${row.label}-label`} className="flex items-center bg-midnight p-5">
                <p className="text-base font-medium text-bone">{row.label}</p>
              </div>,
              <div key={`${row.label}-them`} className="flex items-center bg-midnight p-5">
                <p className="flex items-start gap-2 text-base text-bone/40">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-alert/60" />
                  {row.them}
                </p>
              </div>,
              <div key={`${row.label}-us`} className="flex items-center bg-slate-brand/30 p-5 ring-1 ring-conviction/20">
                <p className="flex items-start gap-2 text-base text-bone/70">
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
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
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
                <h3 className="text-base font-medium text-bone">{faq.q}</h3>
                <p className="text-base leading-relaxed text-bone/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">No obligation. No sales pitch.</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Book your free hour. We&apos;ll tell you what we see and what it
          would cost. If we&apos;re not the right fit, we&apos;ll tell you that
          too.
        </p>
        <div className="mt-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book your free hour <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
