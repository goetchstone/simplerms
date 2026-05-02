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
    "Akritos isn't actively hiring, but we're always open to conversations with experienced Mac admins, IT consultants, and operations leaders who share our values.",
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
    body: "Every team member earns what their work is worth. Senior technicians, operations, and advisory roles all get paid enough to stay, grow, and care about the work. No intern labor disguised as junior roles. No offshore help desks.",
  },
  {
    title: "No knowledge hoarding",
    body: "We document everything and teach constantly — internally and to clients. Nobody is kept in the dark to protect someone else's job security. If you learn something, you share it. If someone shares something, you build on it.",
  },
  {
    title: "Autonomy and trust",
    body: "We hire people who don't need to be managed. You'd own your client relationships, make technical decisions, and be trusted to do the right thing. If you need help, ask. If you see something wrong, say so.",
  },
  {
    title: "Transparency goes both ways",
    body: "We publish our rates to clients. Internally, you'd know how the business works. We don't hide the math. If something isn't working, you'd hear about it before it became a problem.",
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
            We hire carefully.
            <br />
            <span className="text-conviction">When we do, this is what we stand for.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            Akritos isn&apos;t running open job listings right now. We hire when
            the work demands it and when we find the right person — not because
            it&apos;s time to scale a headcount target. If you&apos;ve worked
            with us, in our adjacent communities, or through MacAdmins and you
            think there&apos;s a fit, reach out.
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

      {/* What We Look For */}
      <section className="border-t border-bone/10 px-6 py-24">
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
              management — that&apos;s actually what we teach. We can teach you
              too.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">Interested?</h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          We aren&apos;t posting roles publicly. If this resonates, reach out
          and tell us about yourself. We&apos;d rather know who&apos;s out there
          before we need to hire.
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
            About the founder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
