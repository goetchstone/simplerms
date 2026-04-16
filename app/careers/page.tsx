// app/careers/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Akritos pays living wages, shares knowledge freely, and builds technology that actually works. We're not hiring yet — but when we do, this is what we're looking for.",
  alternates: { canonical: "https://akritos.com/careers" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const commitments = [
  {
    title: "Living wages",
    body: "Every team member earns what they're worth. Senior Apple/MDM technicians start at $70–85K. No intern labor disguised as \"junior roles.\" No offshore help desks. The people who touch client systems get paid enough to stay, grow, and care about the work.",
  },
  {
    title: "No knowledge hoarding",
    body: "We document everything and teach constantly — including internally. You'll never be kept in the dark to protect someone else's job security. If you learn something, you share it. If someone shares something, you build on it.",
  },
  {
    title: "Autonomy and trust",
    body: "We hire people who don't need to be managed. You'll own your client relationships, make technical decisions, and be trusted to do the right thing. If you need help, ask. If you see something wrong, say so.",
  },
  {
    title: "Transparency goes both ways",
    body: "We publish our rates to clients. Internally, you'll know how the business works — revenue, margins, goals. We don't hide the math. If the company does well, you'll see it. If something isn't working, you'll hear about it before it becomes a problem.",
  },
];

const futureRoles = [
  {
    title: "Senior Apple/MDM Technician",
    range: "$70–85K",
    when: "First hire — when managed client count exceeds what one person can deliver well",
    what: "Apple Business Manager, MDM deployment and migration (Mosyle, Jamf, Iru), Google Workspace, macOS security baselines, client-facing work. You'd own delivery for a subset of managed clients.",
  },
  {
    title: "Operations / Admin",
    range: "$25–35K (part-time)",
    when: "Second hire — when scheduling, invoicing, and vendor coordination take more time than they should",
    what: "Client onboarding coordination, invoice management, vendor communication, scheduling. Keeps the business running so technicians can focus on technical work.",
  },
  {
    title: "Junior Technician",
    range: "$55–65K",
    when: "Third hire — when the client base needs more hands and the senior tech needs support",
    what: "Device provisioning, MDM profile deployment, documentation, monitoring. You'd learn the stack on real client environments with real mentorship — not a certification treadmill.",
  },
];

export default async function CareersPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Careers
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            We&apos;re not hiring yet.
            <br />
            <span className="text-conviction">But we will be.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            Akritos is a young company building something different in IT
            consulting. When we grow enough to bring someone on, this is what
            the job looks like and what we commit to as an employer.
          </p>
        </div>
      </section>

      {/* Commitments */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            What We Commit To
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            These aren&apos;t aspirations. They&apos;re rules.
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {commitments.map((c) => (
              <div
                key={c.title}
                className="space-y-2 border-l-2 border-conviction/30 pl-5"
              >
                <h3 className="text-base font-medium text-bone">{c.title}</h3>
                <p className="text-base leading-relaxed text-bone/60">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roles */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Hiring Plan
          </p>
          <h2 className="mb-4 text-[28px] font-medium text-bone">
            Roles we&apos;ll hire for — in order
          </h2>
          <p className="mb-12 text-base text-bone/60">
            We hire when the work demands it, not before. Each role opens when
            the business reaches the point where quality would suffer without it.
          </p>
          <div className="space-y-10">
            {futureRoles.map((r, i) => (
              <div
                key={r.title}
                className="border-l-2 border-conviction/30 pl-6"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-xs font-medium text-conviction">
                    Hire #{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-medium text-bone">{r.title}</h3>
                <p className="mt-1 text-sm text-conviction/80">{r.range}</p>
                <p className="mt-1 text-xs text-bone/40">{r.when}</p>
                <p className="mt-3 text-base leading-relaxed text-bone/60">
                  {r.what}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Who Fits Here
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Skills matter. Character matters more.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-bone/60">
            <p>
              We work with small businesses who trust us with their technology.
              That trust is earned by people who show up prepared, communicate
              clearly, and do honest work. Technical skills can be taught.
              Integrity can&apos;t.
            </p>
            <p>
              You don&apos;t need certifications. You need to be able to sit
              with a client, understand their problem, solve it, document what
              you did, and teach them how to maintain it. If you can do that,
              we&apos;ll figure out the rest together.
            </p>
            <p>
              Apple ecosystem experience is preferred but not required. If
              you&apos;ve spent your career on Windows and want to learn Mac
              management — that&apos;s actually our specialty. We teach Windows
              IT teams how to manage Apple. We can teach you too.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">Interested?</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          We&apos;re not posting job listings yet, but if this resonates with
          you, reach out. We&apos;d rather know who&apos;s out there before
          we need to hire.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:careers@akritos.com"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            <Mail className="h-4 w-4" /> careers@akritos.com
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Learn about the founder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
