// app/about/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, localBusinessSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Goetch Stone — 20+ years in IT, PSU MacAdmins workshop instructor. Started at an MSP, became Director of IT for a multi-location retailer. Founded Akritos to fix what's broken in the industry.",
  alternates: { canonical: "https://akritos.com/about" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const projects = [
  {
    title: "Network infrastructure overhaul",
    duration: "3-year phased rollout",
    context: "Multi-location regional retailer",
    narrative:
      "Planned and executed a full network upgrade across every location — on budget, on schedule. Year one: replaced aging switches with PoE-capable units to build the foundation. Year two: ran fiber links between switches for backbone reliability. Year three: deployed Wi-Fi across all locations. Later revisited the wireless stack and upgraded to Aruba Central. Vetted and onboarded co-managed network partners rather than trying to do everything in-house.",
  },
  {
    title: "New location IT buildouts",
    duration: "Multiple locations",
    context: "Multi-location regional retailer",
    narrative:
      "Planned complete IT buildouts for new retail locations from scratch — structured cabling, phone drops, Wi-Fi access point placement, vendor coordination. Coordinated across multiple vendors and trades to get locations open on time and within budget. Every location launched without IT delays.",
  },
  {
    title: "Phone system migration",
    duration: "End-to-end",
    context: "Multi-location regional retailer",
    narrative:
      "Migrated from a legacy DSU-based phone system to an on-premise Asterisk-based solution. Evaluated vendors, negotiated contracts, planned the cutover, and deployed across locations. No extended downtime, no surprise costs.",
  },
  {
    title: "POS migration & PCI compliance",
    duration: "End-to-end",
    context: "Multi-location regional retailer",
    narrative:
      "Migrated POS data between platforms without data loss. Secured Clover terminals on dedicated VLANs to meet PCI compliance requirements. Built custom reporting using existing tools — no unnecessary vendor spend. Negotiated payment processing rates multiple times, saving the business thousands annually.",
  },
  {
    title: "Apple Business Manager & managed identity",
    duration: "End-to-end",
    context: "Multi-location regional retailer",
    narrative:
      "Deployed Apple Business Manager, federated identity with Google Workspace, and rolled out managed Apple IDs across the organization. This is the exact stack Akritos offers to clients — it was built in production first, not learned from a demo.",
  },
];

export default async function AboutPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={localBusinessSchema()} />
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            About
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            I saw the model from the inside.
            <br />
            <span className="text-conviction">
              Then I built something better.
            </span>
          </h1>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
            {/* Photo slot — replace with real headshot when available */}
            {/* <div className="h-48 w-48 shrink-0 bg-slate-brand/30" style={{ borderRadius: "2px" }} /> */}
            <div>
              <p className="text-lg font-medium text-bone">Goetch Stone</p>
              <p className="text-sm text-conviction">
                Founder &amp; Principal Consultant
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/60">
                20+ years in IT. I&apos;ve been the MSP engineer, the Director
                of IT, and the client. I know where the fees are hidden because
                I used to watch them get added. I started Akritos because small
                businesses deserve a technology partner who works for them — not
                one that profits from their confusion.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-bone/40">
                <a
                  href="https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/4/24696/files/2025/08/psumac2025-873049-Apple-Device-Administration-Essentials-A-Beginners-Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-bone/20 hover:border-conviction hover:text-conviction"
                >
                  PSU MacAdmins workshop instructor
                </a>
                <span className="text-bone/20">·</span>
                <a
                  href="https://www.macadmins.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-bone/20 hover:border-conviction hover:text-conviction"
                >
                  MacAdmins Foundation donor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px] space-y-16">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                Early Career
              </p>
              <p className="mt-1 text-sm font-medium text-bone">
                MSP Engineer
              </p>
            </div>
            <p className="text-sm leading-relaxed text-bone/60">
              Started at a managed service provider. Learned the business inside
              and out — including how the model works. Watched vendors bake fees
              into every layer, mark up hardware, and build dependencies that
              kept clients locked in. The incentives were misaligned: the more
              confused the client, the more the MSP profited.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                12+ Years
              </p>
              <p className="mt-1 text-sm font-medium text-bone">
                Director of IT
              </p>
            </div>
            <p className="text-sm leading-relaxed text-bone/60">
              Became the client. Ran technology for a multi-location regional
              retailer and learned what it actually takes to keep a business
              running. Network deployments, phone systems, POS migrations, PCI
              compliance, vendor negotiations, new location buildouts — all in
              production, all with real budgets and real consequences.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                Community
              </p>
              <p className="mt-1 text-sm font-medium text-bone">
                Workshop Instructor &amp; Donor
              </p>
            </div>
            <p className="text-sm leading-relaxed text-bone/60">
              Presented a{" "}
              <a
                href="https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/4/24696/files/2025/08/psumac2025-873049-Apple-Device-Administration-Essentials-A-Beginners-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/80 underline underline-offset-2 hover:text-conviction"
              >
                hands-on workshop
              </a>{" "}
              on Apple Device Administration at the{" "}
              <a
                href="https://macadmins.psu.edu/conference/resources/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/80 underline underline-offset-2 hover:text-conviction"
              >
                PSU MacAdmins Conference
              </a>{" "}
              at Penn State — the premier conference for Apple enterprise and
              education IT professionals. Covering everything from DUNS
              registration through ABM setup, MDM selection, and zero-touch
              deployment. Donor to the{" "}
              <a
                href="https://www.macadmins.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/80 underline underline-offset-2 hover:text-conviction"
              >
                MacAdmins Foundation
              </a>
              , supporting community education and open-source tooling.
            </p>
          </div>
        </div>
      </section>

      {/* Real Projects */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Real Work
          </p>
          <h2 className="mb-4 text-[28px] font-medium text-bone">
            Projects I planned, executed, and delivered
          </h2>
          <p className="mb-12 text-base text-bone/60">
            Every one of these shipped in a production business environment —
            multi-location retail, real budgets, real deadlines. Client details
            anonymized.
          </p>
          <div className="space-y-10">
            {projects.map((p) => (
              <div
                key={p.title}
                className="border-l-2 border-conviction/30 pl-6"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-sm font-medium text-bone">{p.title}</h3>
                  <span className="text-xs text-bone/30">{p.duration}</span>
                </div>
                <p className="text-xs text-conviction/60">{p.context}</p>
                <p className="mt-3 text-base leading-relaxed text-bone/60">
                  {p.narrative}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Akritos */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Why I Started This
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            The industry is broken. I got tired of watching.
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-bone/60">
            <p>
              Most MSPs make money when you&apos;re confused. They bundle
              services so you can&apos;t see the markup. They take vendor
              kickbacks and call it &ldquo;partnership revenue.&rdquo; They lock
              you into multi-year contracts because they know once you&apos;re
              in, switching costs more than staying.
            </p>
            <p>
              I spent years on both sides of that table. As the MSP engineer, I
              saw how the fees were structured. As the IT director, I saw how
              they landed. The gap between what clients paid and what things
              actually cost was enormous — and it was by design.
            </p>
            <p>
              Akritos exists because I believe there&apos;s a better model.
              Published rates. Zero vendor markup. No kickbacks. No lock-in. You
              own everything we build for you, and you can walk away from any
              vendor at any time — including us.
            </p>
            <p>
              That last part is the point. If I&apos;m good enough, you&apos;ll
              stay because it works. Not because you&apos;re trapped.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Non-Negotiable
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            Rules I make every decision by
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                title: "I don't take vendor kickbacks",
                body: "No referral fees, no partnership revenue, no volume incentives. When I recommend Mosyle over Jamf, it's because it's the right fit — not because one pays me more.",
              },
              {
                title: "I don't mark up vendor costs",
                body: "If a license costs $4/device/month, you pay $4/device/month. I show you the vendor invoice. You verify every dollar.",
              },
              {
                title: "I don't do long-term contracts",
                body: "Month-to-month after a 3-month onboarding period. The onboarding minimum exists because doing this right takes time. After that, you stay because it works.",
              },
              {
                title: "I don't hoard knowledge",
                body: "Every system I build, every process I create — I document it and teach your team. If I get hit by a bus, your business keeps running.",
              },
              {
                title: "I don't sell you things you don't need",
                body: "If your current setup works, I'll tell you. I'd rather lose the sale than put you on something unnecessary.",
              },
              {
                title: "I pay my team living wages",
                body: "When I hire, they earn what they're worth. No intern labor, no offshore help desks, no cutting corners on the people who touch your systems.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="space-y-2 border-l-2 border-conviction/30 pl-5"
              >
                <h3 className="text-sm font-medium text-bone">{p.title}</h3>
                <p className="text-base leading-relaxed text-bone/60">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in touch */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Want to see if we&apos;re a fit?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Book a free consultation or reach out directly. I&apos;ll tell you
          what I see, what it would cost, and whether I&apos;m the right person
          for the job. If I&apos;m not, I&apos;ll tell you that too.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book a free consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="mailto:gstone@akritos.com"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            <Mail className="h-4 w-4" /> gstone@akritos.com
          </a>
        </div>
        <p className="mt-4 text-sm text-bone/30">
          Or call directly: (860) 934-3410
        </p>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
