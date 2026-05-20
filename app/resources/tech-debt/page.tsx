// app/resources/tech-debt/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { TechDebtForm } from "@/components/leads/tech-debt-form";
import { db } from "@/server/db";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  HardDrive,
  ShieldCheck,
} from "lucide-react";

const SITE_URL = "https://akritos.com";
const URL = `${SITE_URL}/resources/tech-debt`;
const TITLE = "Free Download: The Tech Debt Checklist";
const DESCRIPTION =
  "Eight categories, roughly forty questions, one honest hour with your business. The checklist we use to find the hardware, vendors, backups, and identity weaknesses every small business has — before they become emergencies.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Akritos",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const whatsInside = [
  {
    icon: Cpu,
    title: "Eight Categories of Tech Debt",
    body: "Hardware, software, data, network, vendors, identity, security, and people. Every recurring cost and every unmonitored system in a small business — covered, in order, with the questions that surface what's at risk.",
  },
  {
    icon: HardDrive,
    title: "Fillable Worksheet",
    body: "Each category has its own page with room for handwritten answers. Print it, walk through your environment, fill it in. The gaps surface on their own.",
  },
  {
    icon: ShieldCheck,
    title: "Five Principles + Annual Habit",
    body: "Closes with the principles that keep tech debt from creeping back, plus a suggested annual cadence so the checklist stays useful after the first pass.",
  },
];

const whyItExists = [
  "Every small business has tech debt. Most owners don't know how much, or where.",
  "The cost isn't replacement. The cost is everything that happens because the replacement wasn't planned.",
  "An hour with the right questions catches problems while they're still cheap to fix.",
  "This is the checklist we use on the call. It's free either way — walked through with us, or run on your own.",
];

export default async function TechDebtResourcePage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Hero — split: copy left, form right */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: copy */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
                Free Download
              </p>
              <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
                The Tech Debt Checklist
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
                Eight categories. Roughly forty questions. One honest hour with
                your business. The checklist we use to find the hardware,
                vendors, backups, and identity weaknesses every small business
                has — before they become emergencies.
              </p>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-bone/60">
                Free PDF, free to share. Run it yourself, or book a free
                one-hour consultation and we&apos;ll walk it with you.
              </p>

              <ul className="mt-8 space-y-2 text-sm text-bone/60">
                {[
                  "Free PDF, free to share",
                  "No drip campaigns or sales sequences",
                  "Used only to send you what you asked for",
                ].map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-conviction/60" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form card */}
            <div
              className="border border-bone/10 bg-slate-brand/20 p-6 lg:p-8"
              style={{ borderRadius: "2px" }}
            >
              <h2 className="mb-2 text-lg font-medium text-bone">
                Get the checklist
              </h2>
              <p className="mb-6 text-sm text-bone/60">
                Email it to me. I&apos;ll also keep the direct download link
                visible right after you submit.
              </p>
              <TechDebtForm source="tech-debt-page" />
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            What&apos;s Inside
          </p>
          <h2 className="mb-12 text-[28px] font-medium text-bone">
            Ten pages. Eight categories. One habit.
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {whatsInside.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-3 border-l-2 border-conviction/30 pl-5">
                  <Icon className="h-5 w-5 text-conviction" strokeWidth={1.5} />
                  <h3 className="text-base font-medium text-bone">{item.title}</h3>
                  <p className="text-base leading-relaxed text-bone/60">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why it exists */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Why It Exists
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            Tech debt isn&apos;t a tech problem. It&apos;s a planning problem.
          </h2>
          <ul className="space-y-4">
            {whyItExists.map((line) => (
              <li key={line} className="border-l-2 border-conviction/30 pl-5 text-base leading-relaxed text-bone/70">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Connected reading */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Connected Reading
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            The story behind this checklist.
          </h2>
          <div className="space-y-6">
            <Link
              href="/blog/how-old-is-the-ipad-running-your-pos"
              className="group block border-l-2 border-conviction/30 pl-5"
            >
              <h3 className="text-lg font-medium text-bone group-hover:text-conviction">
                How Old Is the iPad Running Your POS? →
              </h3>
              <p className="mt-2 text-base leading-relaxed text-bone/60">
                The blog post this checklist lives inside. The pizza joint, the
                two-station POS, the dongle and the registry, the eighteen years
                of seeing this same pattern.
              </p>
            </Link>
            <Link
              href="/ownership"
              className="group block border-l-2 border-conviction/30 pl-5"
            >
              <h3 className="text-lg font-medium text-bone group-hover:text-conviction">
                Ownership and Vendor Independence →
              </h3>
              <p className="mt-2 text-base leading-relaxed text-bone/60">
                Our service principle: you own everything we build, no
                lock-in, vendor costs pass through at cost. The reason this
                checklist exists in the first place.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Want help walking through it?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Free one-hour consultation. We bring the checklist. We go through your
          environment together. You leave with the checklist filled in — whether
          you hire us or not.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Book your free hour <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ownership"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Ownership service
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
