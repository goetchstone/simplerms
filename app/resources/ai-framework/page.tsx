// app/resources/ai-framework/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { FrameworkForm } from "@/components/leads/framework-form";
import { db } from "@/server/db";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
  ListChecks,
} from "lucide-react";

const SITE_URL = "https://akritos.com";
const URL = `${SITE_URL}/resources/ai-framework`;
const TITLE = "Free Download: The AI Prompt Framework + Definition of Done";
const DESCRIPTION =
  "A 9-layer framework for prompting AI without getting slop, plus a 5-section checklist for evaluating any AI output. Free PDF, free to share. Drawn from the workshop Goetch Stone teaches at PSU MacAdmins.";

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
    icon: Layers,
    title: "The 9-Layer Prompt Framework",
    body: "Walks through the nine things every high-stakes prompt should include: who it's for, what the actual job is, the data the AI must use, the output's shape, and how to iterate. Fillable worksheet format.",
  },
  {
    icon: FileText,
    title: "The Fast Version",
    body: "Three questions for low-stakes work — when the full framework is overkill. Plus a stakes matrix so you know when to use which version.",
  },
  {
    icon: ListChecks,
    title: "Definition of Done Checklist",
    body: "Five checks — accuracy, contradictions, slop, hard questions, gut check — to run on any AI output before you accept it. Yours or someone else's.",
  },
];

const whyItExists = [
  "Most AI output is mediocre because the prompts didn't give the AI enough to work with.",
  "Most AI output gets accepted because it looks finished, not because it's right.",
  "Most people don't have a habit for either side of the problem.",
  "This framework is the habit. Three pages. Print it. Pin it next to your monitor.",
];

export default async function AIFrameworkResourcePage() {
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
                The AI Prompt Framework
                <br />
                <span className="text-conviction">+ Definition of Done</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
                A 9-layer framework for prompting AI without getting slop, plus a
                5-section checklist for evaluating any AI output. Free PDF, free
                to share, no strings.
              </p>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-bone/60">
                Drawn from the workshop Goetch Stone teaches at PSU MacAdmins.
                Tested on real work. Three pages. Print it.
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
                Get the framework
              </h2>
              <p className="mb-6 text-sm text-bone/60">
                Email it to me. I&apos;ll also keep the direct download link
                visible right after you submit.
              </p>
              <FrameworkForm source="ai-framework-page" />
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
            Three pages. Two frameworks. One habit.
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
            AI is a tool. Tools require operators who know what they&apos;re doing.
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
            The series this framework lives inside.
          </h2>
          <div className="space-y-6">
            <Link
              href="/blog/ai-got-good-the-framework"
              className="group block border-l-2 border-conviction/30 pl-5"
            >
              <h3 className="text-lg font-medium text-bone group-hover:text-conviction">
                AI Got Good. Now What? A Framework for Using It Without Getting Burned. →
              </h3>
              <p className="mt-2 text-base leading-relaxed text-bone/60">
                The blog version of this framework, with a worked example. Read this if
                you want context before downloading the PDF.
              </p>
            </Link>
            <Link
              href="/blog/prompt-jockeys-and-the-pci-nightmare"
              className="group block border-l-2 border-conviction/30 pl-5"
            >
              <h3 className="text-lg font-medium text-bone group-hover:text-conviction">
                Prompt Jockeys and the PCI Nightmare →
              </h3>
              <p className="mt-2 text-base leading-relaxed text-bone/60">
                The case study of what goes wrong without this framework — when a
                polished AI document beats an expert&apos;s veto in the conference room.
              </p>
            </Link>
            <Link
              href="/blog/ai-multiplies-talent-it-doesnt-replace-it"
              className="group block border-l-2 border-conviction/30 pl-5"
            >
              <h3 className="text-lg font-medium text-bone group-hover:text-conviction">
                AI Multiplies Talent. It Doesn&apos;t Replace It. →
              </h3>
              <p className="mt-2 text-base leading-relaxed text-bone/60">
                The systemic version: what happens when AI rolls out across a whole
                business without strategy.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Want help putting this in your business?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          We help leadership teams put guardrails on AI use — policy, workflow
          review, vendor evaluation, training. The framework is what we
          internally use to do that work.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ai-risk"
            className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            AI Risk &amp; Guardrails service <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Book a free consultation
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
