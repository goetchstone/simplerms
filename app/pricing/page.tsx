// app/pricing/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, Check } from "lucide-react";

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
    description: "For businesses that need expert help without a recurring commitment.",
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
    name: "Partner",
    price: "$150",
    unit: "/ user / month",
    description: "Ongoing technology partnership. We act as your virtual CTO and keep everything running.",
    features: [
      "Everything in On-Demand",
      "Virtual CTO — ongoing technology leadership",
      "Apple Business & MDM management",
      "Endpoint security and monitoring",
      "Vendor management and negotiations",
      "Quarterly technology reviews",
      "Priority response — same business day",
      "Compliance monitoring (PCI, HIPAA)",
    ],
    cta: "Book a free consultation",
    href: "/book",
    featured: true,
  },
  {
    name: "Co-Managed",
    price: "Custom",
    unit: null,
    description: "You have IT staff. We augment them with architecture, compliance, and the hard decisions.",
    features: [
      "Tailored scope to your team's gaps",
      "Architecture and infrastructure planning",
      "Security audits and compliance",
      "Vendor and contract review",
      "Escalation path for your IT team",
      "Knowledge transfer — we teach, not hoard",
    ],
    cta: "Let's talk",
    href: "/book",
    featured: false,
  },
];

const faqs = [
  {
    q: "Do you take vendor kickbacks?",
    a: "No. We never accept partnership revenue, referral fees, or volume incentives from vendors we recommend. Our recommendations are based on what's right for you, not what pays us the most.",
  },
  {
    q: "What if I want to leave?",
    a: "You leave. There's no exit fee, no contract penalty, no hostage negotiation. You own everything we built for you. We'll even help with the transition to whoever comes next.",
  },
  {
    q: "Why is On-Demand more expensive per hour than Partner?",
    a: "Partner pricing reflects a committed relationship. On-Demand carries the overhead of context-switching, scheduling, and one-off scoping. Both are fair rates for Apple-specialist technology consulting.",
  },
  {
    q: "Do you charge for initial consultations?",
    a: "No. The first conversation is always free. We'll tell you what we see, what it would cost, and whether we're the right fit. If we're not, we'll tell you that too.",
  },
  {
    q: "What's included in 'per user'?",
    a: "All devices for that user. We don't charge per device — a person with a MacBook, iPhone, and iPad is one user, not three charges.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "Partner plans are month-to-month after a 3-month onboarding period. The onboarding minimum exists because it takes time to do this right. After that, you stay because it works, not because you're trapped.",
  },
];

export default async function PricingPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
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
          We believe you should know what something costs before you commit.
          These are our real rates — the same for every client.
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

      {/* Transparency Section */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6 text-center">
          <h2 className="text-[28px] font-medium text-bone">
            What you won&apos;t find on our invoice
          </h2>
          <div className="grid gap-6 text-left sm:grid-cols-2">
            {[
              "Travel fees for local visits",
              "Vendor markup on hardware",
              "Hidden 'project management' charges",
              "Charges for problems we caused",
              "Emergency surcharges for Partner clients",
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

      {/* Non-Profits */}
      <section className="border-t border-bone/10 px-6 py-24">
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
          <h2 className="mb-12 text-center text-[28px] font-medium text-bone">
            Common questions
          </h2>
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
