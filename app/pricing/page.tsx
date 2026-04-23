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
    "Published rates, no surprises. Managed Apple device management at $35/user/month (Apple Business-native) or $50/user/month (with enterprise MDM). Setup and advisory at $225/hr. Typical setups: ~5 hours for small businesses, 20+ for enterprise migrations. Vendor costs pass through at cost — zero markup.",
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
    name: "Get Set Up",
    price: "$225",
    unit: "/ hour",
    description:
      "Apple Business setup, Google Workspace, optional enterprise MDM. Scoped during a free consultation and delivered as one flat number based on our hourly rate. You see the math before we start.",
    features: [
      "Apple Business account setup and configuration",
      "Built-in MDM deployment — no separate platform required",
      "Enterprise MDM when needed (Mosyle, Jamf, Iru, Addigy)",
      "MDM migration from Intune or other platforms",
      "Google Workspace + domain + email + SSO",
      "Identity federation (Apple Business ↔ Google/Microsoft 365)",
      "Team training and documentation",
    ],
    examples: [
      { label: "Small team, Apple Business basics (~5 hrs)", range: "~$1,125" },
      { label: "Apple Business + Google Workspace (~10 hrs)", range: "~$2,250" },
      { label: "Enterprise MDM or Intune migration (20+ hrs)", range: "$4,500+" },
    ],
    cta: "Book a free consultation",
    href: "/book",
    featured: false,
  },
  {
    name: "Apple Business Managed",
    price: "$35",
    unit: "/ user / month",
    description:
      "Ongoing management on Apple Business alone — no separate MDM, no extra tool sprawl. Device enrollment, app deployment, security policies, quarterly reviews. Your team handles day-to-day; we back them up. For small businesses where Apple Business is the right fit.",
    features: [
      "Device enrollment and offboarding",
      "App deployment and updates",
      "Security policy management via built-in MDM",
      "Quarterly environment reviews",
      "Escalation support for your team",
      "Priority response for managed clients",
      "No MDM licensing — Apple Business is free",
      "Minimum 5 users",
      "Month-to-month after 3-month onboarding",
    ],
    examples: [
      { label: "10-person team", range: "$350 /month" },
      { label: "25-person team", range: "$875 /month" },
      { label: "50-person team", range: "$1,750 /month" },
    ],
    cta: "Book a free consultation",
    href: "/book",
    featured: true,
  },
  {
    name: "Enterprise MDM Managed",
    price: "$50",
    unit: "/ user / month",
    description:
      "When Apple Business alone isn't enough — regulated industries, complex deployments, larger fleets. Full management on Mosyle, Jamf, Iru, or Addigy. Your team handles day-to-day; we back them up.",
    features: [
      "Everything in Apple Business Managed, plus:",
      "Enterprise MDM operation (Mosyle, Jamf, Iru, Addigy)",
      "Advanced scripting and configuration profiles",
      "Compliance-oriented policy management",
      "Multi-site and complex deployment support",
      "MDM license billed separately at cost",
      "Minimum 5 users",
      "Month-to-month after 3-month onboarding",
    ],
    examples: [
      { label: "10-person team", range: "$500 /month" },
      { label: "25-person team", range: "$1,250 /month" },
      { label: "50-person team", range: "$2,500 /month" },
    ],
    cta: "Book a free consultation",
    href: "/book",
    featured: false,
  },
  {
    name: "Advisory",
    price: "$225",
    unit: "/ hour",
    description:
      "Payment processing rate negotiation, PCI scope reduction, vendor audits, architecture planning, executive IT. Senior-level expertise when you need it, no retainer required.",
    features: [
      "No contract or minimum hours",
      "Payment processor rate negotiation",
      "PCI scope assessment and reduction",
      "Vendor audit and cost analysis",
      "Contract review and negotiation",
      "Architecture and infrastructure planning",
      "Executive IT support",
      "Remote delivery nationwide",
    ],
    examples: null,
    cta: "Book a session",
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
    q: "What's the difference between Apple Business Managed and Enterprise MDM Managed?",
    a: "Apple Business Managed ($35/user/month) uses the built-in MDM that comes free with Apple Business. No separate license, no extra tools. Right for most small businesses. Enterprise MDM Managed ($50/user/month) adds a dedicated MDM platform (Mosyle, Jamf, Iru, or Addigy) for environments that need advanced scripting, complex configurations, or compliance-specific policy management. We'll tell you which one fits — often it's the cheaper one.",
  },
  {
    q: "What's the difference between managed and advisory?",
    a: "Managed is ongoing Apple device management — we keep your devices enrolled, apps deployed, and policies current. Advisory is one-off consulting — you bring us in for a specific question, payment processor negotiation, or project. Many clients use both.",
  },
  {
    q: "Why no RMM agents?",
    a: "RMM (remote monitoring and management) tools are installed on every device and have deep system access — which makes them a prime target for attackers. We manage through MDM, which is already on Apple devices by design. One less agent, one less attack surface.",
  },
  {
    q: "What if I want to leave?",
    a: "You leave. There's no exit fee, no contract penalty, no hostage negotiation. You own everything we built for you. We'll even help with the transition to whoever comes next.",
  },
  {
    q: "What does a typical monthly bill look like?",
    a: "A 15-person company on Apple Business Managed: $525 for management (15 × $35), plus any advisory hours used. That's it — Apple Business is free. On Enterprise MDM Managed: $750 for management (15 × $50), plus ~$60 for MDM licensing at cost. Every line item is visible and verifiable.",
  },
  {
    q: "Do you charge for initial consultations?",
    a: "No. The first conversation is always free. We'll tell you what we see, what it would cost, and whether we're the right fit. If we're not, we'll tell you that too.",
  },
  {
    q: "Do you replace our IT team?",
    a: "No. We train them. Most clients have competent teams that just lack Apple experience. We set up the infrastructure, train the team on Apple Business, and make sure they can run it independently within 60–90 days. After that, you can keep us on a managed plan for backup and escalation — or run it yourself. Either way, you own everything.",
  },
  {
    q: "We already use Intune. Do we have to get rid of it?",
    a: "No — keep Intune for Windows, it's great at that. We deploy a purpose-built Apple MDM (or Apple Business's built-in MDM) alongside it for your Macs. Intune's Apple management is functional but limited — policy deployment can take 8–24 hours vs. near-instant, and its Apple Business integration is shallow. As the Mac fleet grows, the gap widens. Right tool for the right platform.",
  },
  {
    q: "What does PCI scope reduction actually save?",
    a: "Most businesses we audit are in SAQ C or D when they could be in SAQ A or A-EP. That's the difference between a full audit with quarterly scans and a simple self-assessment. Less scope means lower audit costs, fewer compliance requirements, and reduced breach liability. The rate negotiation usually pays for our time on its own.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "Managed plans are month-to-month after a 3-month onboarding period. The onboarding minimum exists because it takes time to learn your environment and do this right. After that, you stay because it works, not because you're trapped.",
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
          Managed services are per-user. Advisory is hourly. Setup is quoted
          flat after a free consultation — because every environment is
          different and fake ranges help no one. Vendor costs pass through at
          cost — zero markup, ever.
        </p>
        <div className="mt-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book your free consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 pb-24">
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
                  Recurring revenue for us. Predictable cost for you.
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

              {/* Example pricing */}
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
              Most MSPs bundle everything into one per-user fee so you can&apos;t
              see the markup. We do the opposite. Our fee is our fee. Vendor
              costs are vendor costs. You see both.
            </p>
          </div>
          <div className="space-y-1 border border-bone/10 bg-midnight p-6" style={{ borderRadius: "2px" }}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-bone/30">
              Sample monthly invoice — 15-person Apple Business Managed client
            </p>
            <div className="space-y-2 text-base">
              <div className="flex justify-between text-bone/60">
                <span>Apple Business Managed — 15 users × $35</span>
                <span className="text-bone">$525.00</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Apple Business license <span className="text-bone/30">(free from Apple)</span></span>
                <span className="text-bone">$0.00</span>
              </div>
              <div className="flex justify-between text-bone/60">
                <span>Advisory — payment processor rate negotiation, 2 hrs</span>
                <span className="text-bone">$450.00</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-bone/10 pt-3 font-medium">
                <span className="text-bone/60">Total</span>
                <span className="text-bone">$975.00</span>
              </div>
              <div className="pt-2 text-bone/30 text-xs">
                No MDM markup. No hidden vendor fees. Apple Business is free — that savings goes to you, not us.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page consult CTA — risk reversal, low commitment, promised takeaway */}
      <section className="border-t border-bone/10 px-6 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Not Sure Which Tier Fits?
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Tell us about your setup.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/60">
            30 minutes, free, and you walk away with a real number — even if
            you never hire us. We&apos;ll tell you which tier fits, what the
            project would actually cost, and whether you need us at all.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              Book your free consultation <ArrowRight className="h-4 w-4" />
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
              "RMM agent fees or monitoring charges",
              "Hidden 'project management' charges",
              "Charges for problems we caused",
              "Emergency surcharges for managed clients",
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
                them: "Bundled per-user fee hiding markup",
                us: "Per-user management + vendor pass-through",
              },
              {
                label: "Vendor markup",
                them: "20-40% hidden markup",
                us: "Zero. You see the vendor invoice.",
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
