// app/services/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import {
  ArrowRight,
  MonitorSmartphone,
  Server,
  Shield,
  Globe,
  CreditCard,
  Users,
  Handshake,
  Lock,
  FileCheck,
  Wrench,
  ArrowRightLeft,
} from "lucide-react";

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const serviceCategories = [
  {
    category: "Migration & Integration",
    services: [
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
        ],
      },
      {
        icon: Globe,
        title: "API Integration & Bridges",
        description: "Your systems should talk to each other. We build the integrations — REST APIs, webhooks, sync jobs — that connect your tools without creating new dependencies.",
        details: [
          "Custom API integration development",
          "Webhook and event-driven automation",
          "Data sync between platforms",
          "Integration monitoring and error handling",
          "Documentation so your team can maintain it",
        ],
      },
      {
        icon: Wrench,
        title: "Legacy App Modernization",
        description: "FileMaker, Access, ancient Excel workbooks running your business — we've seen it all. We extract your data, understand your workflows, and build you a modern web application that does what the old one did, better. Hosted on a simple VPS for as little as $12/month. You own every line of code.",
        details: [
          "FileMaker, Access, and legacy database migration",
          "Custom web application development",
          "Data extraction, cleanup, and validation",
          "Workflow analysis — we build what you actually need, not a bloated replacement",
          "Self-hosted on affordable infrastructure you control",
          "Full source code ownership — no vendor lock-in, ever",
        ],
      },
    ],
  },
  {
    category: "Setup & Deployment",
    services: [
      {
        icon: MonitorSmartphone,
        title: "Apple Business Setup",
        description: "Apple Business (formerly ABM) enrollment, managed Apple IDs, volume purchasing, and automated device enrollment. We configure it once, correctly, so every device your team opens is ready to work.",
        details: [
          "Apple Business registration and configuration",
          "Automated Device Enrollment (ADE)",
          "Volume Purchase Program (VPP) for apps and books",
          "Managed Apple ID provisioning",
          "Federated authentication with your identity provider",
        ],
      },
      {
        icon: Server,
        title: "Hardware Stack",
        description: "We spec the right hardware for your team — not the most expensive, not the cheapest. Macs, displays, networking, printers, conference room tech. You buy it, you own it. No leasing traps.",
        details: [
          "Mac fleet planning and procurement guidance",
          "Networking — Wi-Fi 6E, VLANs, firewalls",
          "Conference room and AV equipment",
          "Printer and peripheral selection",
          "Lifecycle planning and refresh schedules",
        ],
      },
      {
        icon: Wrench,
        title: "MDM Selection & Deployment",
        description: "Mosyle, Jamf, Kandji, Addigy — we know them all. We recommend based on your team size, budget, and needs. We don't take partnership revenue from any of them.",
        details: [
          "MDM platform evaluation and selection",
          "Zero-touch deployment configuration",
          "App distribution and patch management",
          "Security policies and compliance profiles",
          "Migration from existing MDM if needed",
        ],
      },
    ],
  },
  {
    category: "Compliance & Security",
    services: [
      {
        icon: CreditCard,
        title: "PCI Compliance",
        description: "If you accept credit cards, you need PCI compliance. We walk you through every requirement, audit your current setup, and get you to compliant — properly, not just on paper.",
        details: [
          "PCI DSS assessment and gap analysis",
          "Payment terminal and processor evaluation",
          "Network segmentation for cardholder data",
          "Employee training and policy documentation",
          "Quarterly scan coordination with ASVs",
        ],
      },
      {
        icon: Lock,
        title: "Security Posture",
        description: "Endpoint protection, access controls, encryption, backup verification. We protect your business from real threats — and from vendors who profit from your fear.",
        details: [
          "Endpoint detection and response (EDR)",
          "FileVault encryption enforcement",
          "Password policies and MFA deployment",
          "Backup strategy and recovery testing",
          "Incident response planning",
        ],
      },
      {
        icon: FileCheck,
        title: "Compliance Audits",
        description: "HIPAA, SOC 2, state privacy laws — we know what auditors look for because we've been on both sides of the table. We prepare you to pass, not to panic.",
        details: [
          "HIPAA technical safeguards review",
          "SOC 2 readiness assessments",
          "State privacy law compliance (CCPA, etc.)",
          "Vendor risk assessment documentation",
          "Audit preparation and remediation support",
        ],
      },
    ],
  },
  {
    category: "Ongoing Partnership",
    services: [
      {
        icon: Users,
        title: "Virtual CTO",
        description: "Technology leadership without the executive salary. We attend the meetings that matter, flag risks before they become problems, and make sure your technology decisions are informed — not impulsive.",
        details: [
          "Technology strategy and roadmap",
          "Vendor evaluation and contract review",
          "Budget planning and cost optimization",
          "Board and leadership tech briefings",
          "Risk assessment and mitigation",
        ],
      },
      {
        icon: Handshake,
        title: "Co-Management",
        description: "Your IT team handles the day-to-day. We handle the hard stuff — architecture decisions, compliance requirements, vendor negotiations, and the things that keep IT directors up at night.",
        details: [
          "Escalation support for your IT team",
          "Architecture and infrastructure design",
          "Knowledge transfer — we teach, not hoard",
          "Documentation and runbook development",
          "Capacity planning and scaling guidance",
        ],
      },
      {
        icon: Globe,
        title: "Workspace & Identity",
        description: "Google Workspace, Microsoft 365, Okta, DNS, email routing — set up correctly from day one. You own the domain, you own the accounts, you hold the keys.",
        details: [
          "Google Workspace or Microsoft 365 deployment",
          "SSO and identity provider configuration",
          "DNS and email authentication (SPF, DKIM, DMARC)",
          "Domain registration and management",
          "User lifecycle automation",
        ],
      },
      {
        icon: Shield,
        title: "Vendor & Payment Stack",
        description: "Payment terminals, processors, gateways, POS systems — we help you pick vendors who don't lock you in, negotiate fair rates, and make sure everything talks to everything.",
        details: [
          "Payment processor evaluation and negotiation",
          "POS system selection and deployment",
          "Integration with accounting and inventory",
          "Contract review and exit clause analysis",
          "Vendor consolidation and cost reduction",
        ],
      },
    ],
  },
];

export default async function ServicesPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Services
        </p>
        <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
          Everything you need. Nothing you don&apos;t.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          Every service is designed to leave you more independent than we found
          you. We set it up right, we transfer the knowledge, and you own the
          result.
        </p>
      </section>

      {/* Service Categories */}
      {serviceCategories.map((cat) => (
        <section
          key={cat.category}
          className="border-t border-bone/10 px-6 py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-12 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              {cat.category}
            </p>
            <div className="space-y-16">
              {cat.services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <Icon className="h-5 w-5 text-conviction" strokeWidth={1.5} />
                        <h3 className="text-lg font-medium text-bone">{s.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-bone/60">
                        {s.description}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {s.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-bone/50"
                        >
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
      ))}

      {/* Photo Break */}
      <section className="relative h-[300px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern office workspace"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-midnight/70" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="max-w-lg text-center text-xl font-medium text-bone">
            Every vendor we recommend, every tool we deploy — you can walk away
            from any of it. Including us. That&apos;s the point.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">Not sure where to start?</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/50">
          Book a free consultation. We&apos;ll look at what you have, tell you
          what needs fixing, and give you a clear plan with real numbers.
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
