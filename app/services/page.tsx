// app/services/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, serviceSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Apple Business & MDM, infrastructure planning, data migration, Google Workspace, ongoing IT partnership, vendor management. Every service leaves you more independent.",
  alternates: { canonical: "https://akritos.com/services" },
};
import {
  ArrowRight,
  MonitorSmartphone,
  Server,
  Wrench,
  Globe,
  Handshake,
  CreditCard,
  ArrowRightLeft,
  Phone,
  ShoppingCart,
  Lock,
  FileCheck,
  Camera,
  CloudOff,
  GraduationCap,
  Crown,
  Calculator,
} from "lucide-react";

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

// Core 3 — what we lead with, what people search for, what we have proven track record on.
const coreServices = [
  {
    icon: MonitorSmartphone,
    title: "Apple Business & MDM",
    description: "Apple Business enrollment, managed Apple IDs, automated device enrollment, and the right MDM for your team — Mosyle, Jamf, Kandji, Addigy. We configure it once, correctly, so every device your team opens is ready to work. We don't take partnership revenue from any vendor. Your stack, your choice.",
    details: [
      "Apple Business registration and configuration",
      "Automated Device Enrollment (ADE)",
      "Managed Apple ID provisioning with identity federation",
      "MDM platform evaluation — fit, not kickbacks",
      "Zero-touch deployment for new hires",
      "App distribution and patch management",
      "Migration from existing MDM if needed",
    ],
  },
  {
    icon: Server,
    title: "Infrastructure & Networking",
    description: "We plan the architecture, spec the hardware, and coordinate the people who install it. Wi-Fi, switching, VLANs, firewalls, cabling layout — designed for your space, your team size, and your budget. For ongoing network management, we connect you with trusted co-managed partners. You own every piece of hardware.",
    details: [
      "Network architecture and design",
      "Wi-Fi planning — coverage, capacity, AP placement",
      "Switching, VLANs, and network segmentation",
      "Firewall selection and configuration",
      "Cabling layout planning and installer coordination",
      "New location IT buildouts — wiring, phones, Wi-Fi, vendor coordination",
      "Co-managed partner vetting and onboarding for ongoing network ops",
    ],
  },
  {
    icon: ArrowRightLeft,
    title: "Data Migration",
    description: "Trapped in a system that doesn't work? We get your data out. Clean exports, format conversions, validation, and import into whatever comes next. No data left behind, no vendor holding you hostage.",
    details: [
      "Full data extraction from legacy systems",
      "Format conversion and data cleanup",
      "Validation and integrity verification",
      "Import into new platforms with zero data loss",
      "Parallel running and cutover planning",
      "FileMaker, Access, and legacy database migration",
    ],
  },
];

// Extended 3 — natural follow-ons that keep clients.
const extendedServices = [
  {
    icon: Globe,
    title: "Google Workspace & Email",
    description: "Google Workspace, Microsoft 365, DNS, email routing, SSO — set up correctly from day one. You own the domain, you own the accounts, you hold the keys. We handle SPF, DKIM, DMARC so your email doesn't land in spam.",
    details: [
      "Google Workspace or Microsoft 365 deployment",
      "SSO and identity provider configuration",
      "DNS and email authentication (SPF, DKIM, DMARC)",
      "Domain registration and management",
      "User lifecycle automation",
    ],
  },
  {
    icon: Handshake,
    title: "Ongoing IT Partnership",
    description: "Technology leadership without the six-figure salary. We attend the meetings that matter, handle architecture decisions, vendor negotiations, and the projects that need senior experience. Your team handles the day-to-day — we handle the hard stuff.",
    details: [
      "Technology strategy and roadmap",
      "Vendor evaluation and contract review",
      "Escalation support for your IT team",
      "Budget planning and cost optimization",
      "Knowledge transfer — we teach, not hoard",
      "Quarterly technology reviews",
    ],
  },
  {
    icon: CreditCard,
    title: "Vendor Management",
    description: "Are you overpaying? Locked into a bad contract? We audit your vendor stack, negotiate better rates, review exit clauses, and make sure you can walk away when you need to. We work for you, not the vendor.",
    details: [
      "Vendor audit and cost analysis",
      "Contract review and exit clause analysis",
      "Payment processor rate negotiation",
      "Vendor consolidation and cost reduction",
      "RFP development and vendor selection",
    ],
  },
];

// Everything else — listed compactly, not full service cards.
const alsoServices = [
  { icon: Wrench, title: "Legacy App Modernization", description: "FileMaker, Access, ancient spreadsheets — we migrate your data and build modern replacements." },
  { icon: ShoppingCart, title: "E-Commerce & POS", description: "Shopify, Square, Toast, Clover — setup, integration, and payment rate negotiation." },
  { icon: Phone, title: "VoIP & Phone Systems", description: "Modern phone systems at a fraction of legacy costs. Migration, porting, call flow design." },
  { icon: Lock, title: "Security Posture", description: "Endpoint protection, encryption enforcement, MFA, backup verification, incident response planning." },
  { icon: FileCheck, title: "Compliance Guidance", description: "PCI, HIPAA scope reduction, practical risk assessment. We connect you with auditors when needed." },
  { icon: Calculator, title: "Accounting Integration", description: "QuickBooks, Xero, payroll, inventory — connected so the data flows without manual entry." },
  { icon: Camera, title: "Camera & Physical Security", description: "Ubiquiti, Verkada — designed, installed, and configured. You own and control the system." },
  { icon: CloudOff, title: "Business Continuity", description: "Disaster recovery planning, backup testing, ransomware response. Actually tested, not just documented." },
  { icon: GraduationCap, title: "Staff Training", description: "Security awareness, tool training, onboarding/offboarding checklists." },
  { icon: Crown, title: "White Glove Executive IT", description: "Home office, network, and device management for executives. Discreet, thorough, referral-only." },
];

const allServiceNames = [
  ...coreServices.map((s) => ({ name: s.title, description: s.description })),
  ...extendedServices.map((s) => ({ name: s.title, description: s.description })),
  ...alsoServices.map((s) => ({ name: s.title, description: s.description })),
];

export default async function ServicesPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      {allServiceNames.map((s) => (
        <JsonLd key={s.name} data={serviceSchema(s)} />
      ))}
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Services
        </p>
        <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
          What we actually do
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          Every service is designed to leave you more independent than we found
          you. We set it up right, we transfer the knowledge, and you own the
          result.
        </p>
      </section>

      {/* Core Services */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Core Services
          </p>
          <div className="space-y-20">
            {coreServices.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-conviction" strokeWidth={1.5} />
                      <h2 className="text-lg font-medium text-bone">{s.title}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-bone/60">
                      {s.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-bone/50">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extended Services */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Ongoing Partnership
          </p>
          <div className="space-y-20">
            {extendedServices.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-conviction" strokeWidth={1.5} />
                      <h2 className="text-lg font-medium text-bone">{s.title}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-bone/60">
                      {s.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-bone/50">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Also Services — compact grid */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            We Also Do
          </p>
          <p className="mb-12 text-sm text-bone/40">
            Not every engagement needs these — but when yours does, we handle it.
          </p>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {alsoServices.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-midnight p-6 transition-colors hover:bg-slate-brand/20"
                >
                  <Icon className="mb-3 h-4 w-4 text-conviction" strokeWidth={1.5} />
                  <h3 className="mb-2 text-sm font-medium text-bone">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-bone/40">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limited capacity */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-sm leading-relaxed text-bone/50">
            We intentionally limit the number of clients we work with. Every
            business we partner with gets direct access to senior-level
            expertise — not a help desk. If we&apos;re at capacity,
            we&apos;ll tell you and refer you to someone we trust.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">Not sure where to start?</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/50">
          Book a free consultation. We&apos;ll look at what you have, tell you
          what needs fixing, and give you a clear plan with real numbers. No
          sales pitch — if we&apos;re not the right fit, we&apos;ll say so.
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
            href="/pricing"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            View pricing
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
