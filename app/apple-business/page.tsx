// app/apple-business/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import {
  ArrowRight,
  MonitorSmartphone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apple Business — Setup & Management for Small Businesses",
  description:
    "Apple just consolidated Apple Business Manager, Apple Business Essentials, and Apple Business Connect into one free platform. For most small businesses running Apple devices, it's all the IT management you need. We help you set it up and manage it alongside your team.",
  alternates: { canonical: "https://akritos.com/apple-business" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const included = [
  {
    icon: MonitorSmartphone,
    title: "Device management",
    body: "Built-in MDM. Enroll Macs, iPhones, and iPads automatically. Push apps, enforce security policies, wipe lost devices. The same capability that used to require a separate paid platform.",
  },
  {
    icon: Mail,
    title: "Business email & calendar",
    body: "Managed Apple accounts with your own domain. Email, calendar, and contacts that work across every Apple device your team uses.",
  },
  {
    icon: MapPin,
    title: "Local presence",
    body: "Your business profile in Apple Maps, Spotlight, Messages, Siri, and Wallet. What used to be Apple Business Connect, now included.",
  },
];

const whenEnough = [
  "5–50 employees using Apple devices",
  "Standard security requirements, no regulated data (PCI, HIPAA, FedRAMP)",
  "No existing MDM — or a small one you'd happily replace",
  "Want one free tool instead of three paid ones",
  "Internal team is willing to own day-to-day with our backup",
];

const whenMore = [
  "Regulated industries with specific compliance requirements",
  "Complex multi-site deployments, shared iPad workflows",
  "Advanced scripting and configuration profiles beyond the built-in policies",
  "100+ devices where enterprise-grade reporting matters",
  "Existing Jamf, Mosyle, or Iru deployment that's working well",
];

export default async function AppleBusinessPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Apple Business
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            Apple replaced three tools with one.
            <br />
            <span className="text-conviction">
              For most small businesses, it&apos;s enough.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            Apple just consolidated Apple Business Manager, Apple Business
            Essentials, and Apple Business Connect into a single platform
            called Apple Business. For most small businesses running Apple
            devices, this is all the IT management you need — no separate
            MDM, no enterprise complexity. We help you set it up right, then
            manage it alongside your team so it stays that way.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              Book a free consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              View pricing
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-bone/40">
            {[
              "Apple Business itself is free",
              "No monthly fees for device management",
              "Paid add-ons optional (iCloud, AppleCare+)",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-conviction/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            What You Get
          </p>
          <h2 className="mb-12 text-[28px] font-medium text-bone">
            Three products. One platform. Zero monthly fees.
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="space-y-3 border-l-2 border-conviction/30 pl-5"
                >
                  <Icon
                    className="h-5 w-5 text-conviction"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-base font-medium text-bone">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-bone/60">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-12 text-sm text-bone/40">
            Apple Business replaces Apple Business Manager (device management),
            Apple Business Essentials (subscription IT), and Apple Business
            Connect (local presence) with one free platform. Optional paid
            add-ons exist for iCloud storage and AppleCare+ — you only pay for
            what you actually need.
          </p>
        </div>
      </section>

      {/* When it's enough vs when you need more */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Honest Fit
          </p>
          <h2 className="mb-12 text-[28px] font-medium text-bone">
            When Apple Business is enough — and when it&apos;s not.
          </h2>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-conviction">
                This is you
              </h3>
              <ul className="space-y-3">
                {whenEnough.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-base text-bone/60"
                  >
                    <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-bone/40">
                You need more than this
              </h3>
              <ul className="space-y-3">
                {whenMore.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-base text-bone/40"
                  >
                    <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-bone/20" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="mt-12 border border-conviction/20 bg-slate-brand/20 p-6"
            style={{ borderRadius: "2px" }}
          >
            <p className="text-base leading-relaxed text-bone/70">
              <span className="font-medium text-bone">
                If Apple Business isn&apos;t enough, we&apos;ll tell you.
              </span>{" "}
              We also deploy Mosyle, Iru, Jamf, and Addigy when the environment
              calls for them. The right tool is whatever fits — not whatever
              pays us the most.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            How We Help
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            Setup, then partnership.
          </h2>
          <div className="space-y-10">
            <div className="border-l-2 border-conviction/30 pl-6">
              <h3 className="text-base font-medium text-bone">Setup</h3>
              <p className="mt-3 text-base leading-relaxed text-bone/60">
                DUNS registration, Apple Business account verification, domain
                and email configuration, Automated Device Enrollment,
                Google Workspace or Microsoft 365 federation, baseline security
                policies, and the first wave of device enrollments. Done
                remotely. Documented as we go.
              </p>
            </div>
            <div className="border-l-2 border-conviction/30 pl-6">
              <h3 className="text-base font-medium text-bone">Training</h3>
              <p className="mt-3 text-base leading-relaxed text-bone/60">
                Your team — whoever manages IT today, whether that&apos;s a
                dedicated person, an office manager, or a Windows team picking
                up Apple — learns to operate Apple Business day-to-day. Adding
                users. Enrolling new devices. Handling departures. We show
                them, then we hand them the keys.
              </p>
            </div>
            <div className="border-l-2 border-conviction/30 pl-6">
              <h3 className="text-base font-medium text-bone">Ongoing management</h3>
              <p className="mt-3 text-base leading-relaxed text-bone/60">
                We stay on as backup. Quarterly reviews, security policy
                updates, escalation when your team hits something unfamiliar,
                and proactive changes when Apple ships something new. You run
                it. We make sure it keeps running right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Not sure if this is enough for your business?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Book a free consultation. We&apos;ll look at what you have, tell you
          whether Apple Business alone covers it, and give you a real plan
          either way. No sales pitch.
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
            href="/services"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            See all services
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
