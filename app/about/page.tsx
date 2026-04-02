// app/about/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, localBusinessSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "20+ years in IT. Started at an MSP, saw the model from the inside, and built something better. Meet the founder of Akritos.",
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

const timeline = [
  {
    period: "Early Career",
    role: "MSP Engineer",
    description:
      "Started at a managed service provider. Learned the business inside and out — including how the model works. Watched vendors bake fees into every layer, mark up hardware, and build dependencies that kept clients locked in. Saw firsthand how the incentives were misaligned: the more confused the client, the more the MSP profited.",
  },
  {
    period: "12+ Years",
    role: "Director of IT — Regional Retailer",
    description:
      "Became the client. Ran technology for a multi-location retail operation and learned what it actually takes to keep a business running. Not theory — real infrastructure, real vendors, real problems, real budgets.",
  },
  {
    period: "Community",
    role: "MacAdmins Conference Speaker",
    description:
      "Speaker at MacAdmins — the premier conference for Apple enterprise and education IT professionals. Because the best way to stay sharp is to teach, and the best way to earn trust is to give knowledge away.",
  },
];

const accomplishments = [
  "Planned and executed the original Wi-Fi and network deployment across all locations",
  "Designed and led the Wi-Fi upgrade — new access points, new architecture, zero downtime",
  "Upgraded to fiber links between switches for backbone reliability",
  "Built a custom application to track and manage consignment inventory — replacing manual processes with software the business owned",
  "Negotiated payment processing rates multiple times — saving the business thousands annually",
  "Managed two full data migrations between platforms without data loss",
  "Planned and deployed the phone system — evaluated vendors, negotiated contracts, oversaw installation",
  "Managed all vendor relationships with a simple rule: no lock-in, no long-term contracts, full data portability",
];

export default async function AboutPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={localBusinessSchema()} />
      <SiteNav companyName={companyName} />

      {/* Header */}
      <section className="px-6 pb-12 pt-24 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          About
        </p>
        <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
          I saw the model from the inside.
          <br />
          <span className="text-conviction">Then I built something better.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/60">
          20+ years in IT. I&apos;ve been the engineer, the director, the
          vendor, and the client. I know where the fees are hidden because I
          used to watch them get added.
        </p>
      </section>

      {/* Origin */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <div className="space-y-16">
            {timeline.map((t) => (
              <div key={t.period} className="grid gap-6 md:grid-cols-[200px_1fr]">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                    {t.period}
                  </p>
                  <p className="mt-1 text-sm font-medium text-bone">{t.role}</p>
                </div>
                <p className="text-sm leading-relaxed text-bone/60">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I Actually Did */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Track Record
          </p>
          <h2 className="mb-4 text-[28px] font-medium text-bone">
            Not a resume. A list of things that actually shipped.
          </h2>
          <p className="mb-10 text-sm text-bone/50">
            Every one of these was planned, executed, and delivered in a
            production business environment — not a lab, not a demo, not a
            proof of concept.
          </p>
          <ul className="space-y-4">
            {accomplishments.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 text-sm leading-relaxed text-bone/60"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                {a}
              </li>
            ))}
          </ul>
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
              kickbacks and call it &ldquo;partnership revenue.&rdquo; They
              lock you into multi-year contracts because they know once
              you&apos;re in, switching costs more than staying.
            </p>
            <p>
              I spent years on both sides of that table. As the MSP engineer, I
              saw how the fees were structured. As the IT director, I saw how
              they landed. The gap between what clients paid and what things
              actually cost was enormous — and it was by design.
            </p>
            <p>
              Akritos exists because I believe there&apos;s a better model.
              Published rates. Zero vendor markup. No kickbacks. No lock-in.
              You own everything we build for you, and you can walk away from
              any vendor at any time — including us.
            </p>
            <p>
              That last part is the point. If we&apos;re good enough, you&apos;ll
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
              <div key={p.title} className="space-y-2 border-l-2 border-conviction/30 pl-5">
                <h3 className="text-sm font-medium text-bone">{p.title}</h3>
                <p className="text-sm leading-relaxed text-bone/50">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Want to see if we&apos;re a fit?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/50">
          Book a free consultation. I&apos;ll tell you what I see, what it
          would cost, and whether I&apos;m the right person for the job. If
          I&apos;m not, I&apos;ll tell you that too.
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
            View services
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
