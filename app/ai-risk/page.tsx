// app/ai-risk/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, serviceSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import {
  ArrowRight,
  ShieldAlert,
  ScrollText,
  Users,
  ClipboardCheck,
  AlertTriangle,
} from "lucide-react";

const SITE_URL = "https://akritos.com";
const URL = `${SITE_URL}/ai-risk`;
const TITLE = "AI Risk & Guardrails for SMBs";
const DESCRIPTION =
  "Your team uses AI. Most of them aren't AI experts. We help leadership put guardrails on AI use — what's safe to delegate, what isn't, and how to spot polished-and-wrong output before it ships.";

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

const whatWeDo = [
  {
    icon: ScrollText,
    title: "AI use policy",
    body: "A short, real document — not a 30-page legalese binder. What employees can and can't run through AI, what data must never leave the company, what review is required before AI output becomes policy or a customer deliverable.",
  },
  {
    icon: ClipboardCheck,
    title: "Workflow review",
    body: "We sit with the people who use AI day-to-day and identify the workflows where AI helps versus where it's adding risk. Then we redesign the high-risk ones so the human remains the decision-maker.",
  },
  {
    icon: Users,
    title: "Training your team",
    body: "Practical sessions on spotting polished-and-wrong output, when to stop and call an SME, how to ground prompts in real data, and how to use AI without becoming dependent on a tool that confidently lies sometimes.",
  },
  {
    icon: ShieldAlert,
    title: "Vendor evaluation",
    body: "Before you sign a $50K AI contract, we read the data terms. Where does your data go? Who trains on it? What's the audit trail? What happens when the vendor pivots or shuts down? We tell you what the sales team won't.",
  },
];

const whenItMatters = [
  "Compliance documents (PCI, HIPAA, SOX) — wrong here means audit findings, fines, or breach liability",
  "Security plans and architecture — confidently wrong looks confidently right until something gets exploited",
  "Contract language — AI-drafted contracts have invented clauses, missing protections, and \"widely used in similar agreements\" claims based on nothing",
  "Customer-facing communications — AI confidently states things that aren't true about your business",
  "Technical deployment plans — AI suggests commands that work in its training data, not in your environment",
  "Executive decisions where the AI document is competing with an SME's verbal objection",
];

export default async function AIRiskPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={serviceSchema({ name: TITLE, description: DESCRIPTION })} />
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            AI Risk &amp; Guardrails
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            Your team uses AI.
            <br />
            <span className="text-conviction">
              We make sure the wrong answer doesn&apos;t become policy.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            AI in your business produces confident, polished, often wrong work.
            The output sounds like it was written by a senior consultant — and
            it gets accepted because it sounds right. We help leadership put
            guardrails on AI use: where it&apos;s safe to delegate, where it
            isn&apos;t, and how the people in your organization who actually
            know your business can override AI output without being treated as
            the obstacle.
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
              href="/blog/prompt-jockeys-and-the-pci-nightmare"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              Read the prompt jockey post
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            What We Do
          </p>
          <h2 className="mb-12 text-[28px] font-medium text-bone">
            Four things, done well, instead of an AI buzzword bingo card.
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {whatWeDo.map((item) => {
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
          <p className="mt-12 text-sm text-bone/40">
            Not in scope: building ML models, fine-tuning LLMs, integrating
            ChatGPT into your product, prompt-engineering as a service. Plenty
            of firms do that. We focus on the judgment layer — the part that
            keeps AI output from becoming a liability.
          </p>
        </div>
      </section>

      {/* When it matters */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            When This Matters Most
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            High-stakes documents that look done.
          </h2>
          <ul className="space-y-3">
            {whenItMatters.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base leading-relaxed text-bone/60"
              >
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-conviction/70" />
                {item}
              </li>
            ))}
          </ul>
          <div
            className="mt-12 border border-conviction/20 bg-slate-brand/20 p-6"
            style={{ borderRadius: "2px" }}
          >
            <p className="text-base leading-relaxed text-bone/70">
              <span className="font-medium text-bone">The pattern is consistent:</span>{" "}
              someone without domain knowledge generates a document that uses
              the right vocabulary. The actual SME says &quot;this is a
              nightmare&quot; — five words against an eight-page document. The
              document wins on optics. We help your SMEs not lose those rooms.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Have an AI document you&apos;re not sure about?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Bring it to a free consultation. We&apos;ll tell you what&apos;s
          right, what&apos;s invented, and what would actually be required to
          make it real. No sales pitch.
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
