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
    "Apple Business setup and management, enterprise MDM when you need it, Google Workspace, and Mac management training. We keep it simple — no unnecessary tools, no enterprise complexity where it doesn't belong.",
  alternates: { canonical: "https://akritos.com/services" },
};
import {
  ArrowRight,
  MonitorSmartphone,
  Laptop,
  Globe,
  CreditCard,
  Crown,
  Wrench,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const coreServices = [
  {
    icon: MonitorSmartphone,
    title: "Apple Business Setup & Management",
    description: "Apple's new all-in-one platform for device management, business email, and local presence — free, and for most small businesses running Apple devices, enough on its own. We handle DUNS registration, account verification, managed Apple account provisioning, Automated Device Enrollment, and identity federation with Google Workspace or Microsoft 365. Then we manage it alongside your team.",
    details: [
      "Apple Business account registration and verification",
      "Managed Apple account provisioning",
      "Identity federation with Google Workspace or Microsoft 365",
      "Automated Device Enrollment (ADE) configuration",
      "Volume purchasing and app distribution",
      "Built-in MDM setup — no separate platform required",
      "Business email with your custom domain",
      "Local presence (Apple Maps, Spotlight, Siri, Wallet)",
    ],
  },
  {
    icon: Laptop,
    title: "Enterprise MDM — When You Actually Need It",
    description: "For most small businesses, Apple Business's built-in MDM is enough. When it isn't — regulated industries, complex deployments, large fleets — we deploy Mosyle, Jamf, Iru, or Addigy based on fit, not kickbacks. We'll tell you which path makes sense for you. Already running Intune? Keep it for Windows; purpose-built Apple MDM alongside.",
    details: [
      "Honest evaluation: Apple Business or something more?",
      "Mosyle, Jamf, Iru, Addigy — chosen for fit, not markup",
      "Zero-touch deployment for new hires",
      "Apple MDM deployed alongside Intune for Windows",
      "Migration from existing MDM or from no MDM",
      "App deployment, patching, and security policy configuration",
    ],
  },
  {
    icon: Globe,
    title: "Google Workspace Setup",
    description: "Google Workspace, domain, email, SSO, and directory — configured correctly from day one and federated with Apple Business for seamless identity. You own the domain, you own the accounts, you hold the keys. We handle SPF, DKIM, DMARC so your email actually arrives.",
    details: [
      "Google Workspace deployment and domain configuration",
      "SSO and identity provider setup",
      "Identity federation with Apple Business",
      "DNS and email authentication (SPF, DKIM, DMARC)",
      "User lifecycle automation",
      "Domain registration and management",
    ],
  },
];

const advisoryServices = [
  {
    icon: CreditCard,
    title: "Payment Processing & PCI Scope Reduction",
    description: "Most businesses are in a broader PCI scope than necessary and paying higher card processing rates than they should. We audit your current setup, negotiate better rates, and reduce your compliance surface. Less scope means lower audit costs, fewer requirements, and reduced breach liability.",
    details: [
      "Payment processing rate audit and negotiation",
      "PCI scope assessment and reduction planning",
      "SAQ level optimization (C/D → A/A-EP where possible)",
      "Tokenization and scope-reducing architecture guidance",
      "Processor contract review and competitive benchmarking",
    ],
  },
  {
    icon: Crown,
    title: "Executive IT",
    description: "C-suite runs on Apple. Home office network, devices, security, and seamless integration with the company environment. Discreet, thorough, and available when they need it — not when the help desk gets around to it.",
    details: [
      "Home office network and Wi-Fi optimization",
      "Personal and company device management",
      "Security hardening for high-profile targets",
      "Seamless integration with corporate environment",
      "Priority response and direct access",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Digital Legacy & Account Recovery",
    description: "Your Apple ID, your passwords, your accounts — what happens to them if you get locked out, or if you die? Most people have no plan. We set up Apple Legacy Contact, configure account recovery options, build a password manager that actually works, and document everything so the right people can access the right things when it matters.",
    details: [
      "Apple Legacy Contact and Account Recovery Contact setup",
      "Recovery key generation and secure storage planning",
      "Password manager setup — iCloud Keychain, 1Password, or both",
      "Shared family vault configuration and emergency access",
      "Digital estate documentation — accounts, access, instructions",
      "Ongoing review as accounts and services change",
    ],
  },
  {
    icon: Wrench,
    title: "IT Advisory",
    description: "Vendor negotiations, contract reviews, architecture planning, and the hard questions that need senior experience. No retainer required. We work for you, not the vendor.",
    details: [
      "Vendor audit and cost analysis",
      "Contract review and exit clause analysis",
      "Architecture and infrastructure planning",
      "Technology strategy and roadmap",
      "RFP development and vendor selection",
    ],
  },
  {
    icon: ShieldAlert,
    title: "AI Risk & Guardrails for SMBs",
    description: "Your team uses AI. Most aren't AI experts. We help leadership put guardrails on AI use — what's safe to delegate, what isn't, and how to spot polished-and-wrong output before it ships. Pro-judgment, not anti-AI. Read the prompt jockey post for the full framing.",
    details: [
      "AI use policy — short, real, enforceable",
      "Workflow review — where AI helps vs. where it adds risk",
      "Vendor evaluation — data terms, audit trail, exit risk",
      "Team training — spotting confidently-wrong output",
      "SME workflow design — keeping the human as decision-maker",
      "Linked: detailed page at /ai-risk",
    ],
  },
];

const allServiceNames = [
  ...coreServices.map((s) => ({ name: s.title, description: s.description })),
  {
    name: "Mac Management Training for Windows Teams",
    description:
      "We train your Windows-native IT team to manage Apple devices with MDM. Not outsourced IT — IT team enablement. Independence in 60-90 days.",
  },
  ...advisoryServices.map((s) => ({ name: s.title, description: s.description })),
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
          Apple device management, done simply
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          Apple Business is free and — for most small businesses — enough on
          its own. When it&apos;s not, we deploy the right MDM. Either way, we
          manage it alongside your team. No unnecessary tools. No enterprise
          complexity where it doesn&apos;t belong.
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
                    <p className="text-base leading-relaxed text-bone/60">
                      {s.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-base text-bone/60">
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

      {/* Mac Management Training — the differentiator */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            The Differentiator
          </p>
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-conviction" strokeWidth={1.5} />
              <h2 className="text-2xl font-medium text-bone">
                Mac management training for Windows teams
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-bone/60">
              Your IT team knows Windows — Group Policy, SCCM, Active Directory.
              Then the company buys Macs and nothing transfers. MDM is not Group
              Policy. Apple IDs are not AD accounts. The management model is
              fundamentally different. We bridge that gap.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-bone/40">
                What we teach
              </h3>
              <ul className="space-y-3">
                {[
                  "How MDM works vs. Group Policy — the mental model shift",
                  "Apple Business and device enrollment workflows",
                  "MDM console operation — profiles, policies, app deployment",
                  "macOS security model vs. Windows security model",
                  "Troubleshooting Mac-specific issues your team will actually hit",
                  "Ongoing self-sufficiency — new hires, offboarding, OS updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-base text-bone/60">
                    <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-bone/40">
                How it works
              </h3>
              <ul className="space-y-3">
                {[
                  "We set up Apple Business + MDM alongside your team",
                  "Hands-on training during the deployment, not a separate class",
                  "Your team operates the MDM console from day one",
                  "Knowledge transfer documentation specific to your environment",
                  "Post-training support period for questions that come up in practice",
                  "Goal: your team runs this independently within 60–90 days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-base text-bone/60">
                    <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-conviction/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Callout */}
          <div
            className="mt-12 border border-conviction/20 bg-midnight p-6"
            style={{ borderRadius: "2px" }}
          >
            <p className="text-base leading-relaxed text-bone/60">
              <span className="font-medium text-bone">This is NOT outsourced IT.</span>{" "}
              We want your team to be confident managing their own Macs. We
              set it up, train your people, and make sure you can run it
              without us — even if you choose to keep us around.
            </p>
            <p className="mt-3 text-xs text-bone/30">
              Goetch Stone presented a{" "}
              <a
                href="https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/4/24696/files/2025/08/psumac2025-873049-Apple-Device-Administration-Essentials-A-Beginners-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-conviction/60 underline underline-offset-2 hover:text-conviction"
              >
                hands-on workshop
              </a>{" "}
              on exactly this topic at the{" "}
              <a
                href="https://macadmins.psu.edu/conference/resources/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-conviction/60 underline underline-offset-2 hover:text-conviction"
              >
                PSU MacAdmins Conference
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Services */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Advisory &amp; Specialized
          </p>
          <div className="space-y-20">
            {advisoryServices.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-conviction" strokeWidth={1.5} />
                      <h2 className="text-lg font-medium text-bone">{s.title}</h2>
                    </div>
                    <p className="text-base leading-relaxed text-bone/60">
                      {s.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-base text-bone/60">
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

      {/* Limited capacity */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-base leading-relaxed text-bone/60">
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
