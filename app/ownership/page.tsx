// app/ownership/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd, serviceSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import {
  ArrowRight,
  Key,
  ListChecks,
  Users,
  ClipboardList,
  ShieldOff,
} from "lucide-react";

const SITE_URL = "https://akritos.com";
const URL = `${SITE_URL}/ownership`;
const TITLE = "Vendor Independence Audit";
const DESCRIPTION =
  "You don't need to own your whole tech stack. You need to own the keys to move. We help small businesses find what they're missing, take it back, and walk away from any vendor on their timeline.";

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

const whatDies = [
  {
    holds: "Your domain registration",
    dies: "Website goes dark. Email stops. Marketing assets unreachable.",
  },
  {
    holds: "Your DNS records",
    dies: "Email auth breaks. Apps that depend on hostnames fail.",
  },
  {
    holds: "Your SSL certs",
    dies: "Browser warnings on your site. SaaS integrations break.",
  },
  {
    holds: "Your cloud account root",
    dies: "Data trapped. Billing in their name. No transfer path.",
  },
  {
    holds: "Your Google Workspace owner role",
    dies: "Email, calendar, docs — admin keys gone with them.",
  },
  {
    holds: "Your backups (in their storage)",
    dies: "Backups die when they do.",
  },
  {
    holds: "Your password manager (their account)",
    dies: "Every credential lost.",
  },
  {
    holds: "Your Apple Business / MDM",
    dies: "Devices orphaned. Apps can't update. New hires can't enroll.",
  },
];

const auditSteps = [
  {
    icon: ListChecks,
    title: "We share a checklist of gotchas",
    body: "Domain. DNS. Cloud root. Workspace owner. Backup access. Password vault. Each one a key. The list is short, specific, and easy to understand even if you've never thought about it.",
  },
  {
    icon: Users,
    title: "You answer what you can. For the rest, we find who would know.",
    body: "Most owners can't answer the whole list off the top of their head. That's normal. We help you identify who in your world would know — your IT person, your bookkeeper, your developer, your MSP — and we facilitate the conversation. With your permission, we ask them directly so you don't have to.",
  },
  {
    icon: ClipboardList,
    title: "You get the answers and a plan of action",
    body: "A written summary: what you own, what you don't, what to take back, and the order to do it in. The plan is yours. You can implement it yourself, hand it to your existing IT, or hire us to execute. We don't lock the document behind ongoing work.",
  },
];

const examples = [
  "Who's the registrant on your domain — your business or your IT provider?",
  "Can you log in to the DNS console without going through someone else?",
  "Who's the super-admin on your Google Workspace or Microsoft 365 tenant?",
  "Where do your backups live, and can you restore them without your current IT?",
  "Who controls the root credentials on your AWS / Azure / Google Cloud account?",
  "Who owns your business profile on Apple Maps, Google Business, Meta?",
  "If your IT provider disappeared tomorrow, what wouldn't you be able to recover?",
];

export default async function OwnershipPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={serviceSchema({ name: TITLE, description: DESCRIPTION })} />
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Vendor Independence
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            You don&apos;t need to own your whole tech stack.
            <br />
            <span className="text-conviction">
              You need to own the keys to move.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            Your domain. Your DNS. Your cloud account root credentials. Your
            Google Workspace owner role. Your backups. Your data exports. Most
            business owners don&apos;t realize they&apos;re missing those
            keys — until the day they try to leave a vendor and can&apos;t.
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-bone/60">
            We find what you&apos;re missing, help you take it back, and
            document it so you can walk away from any vendor on your timeline.
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
              href="#process"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              How the audit works
            </Link>
          </div>
        </div>
      </section>

      {/* What dies if they disappear */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            What&apos;s at Stake
          </p>
          <h2 className="mb-6 text-[28px] font-medium text-bone">
            What happens if your IT provider disappears tomorrow?
          </h2>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-bone/60">
            MSPs are bought, sold, shut down, or pivot every day. So do payment
            processors, marketing agencies, and SaaS vendors. The question
            isn&apos;t whether one of yours will eventually go away. It&apos;s
            whether you&apos;ll keep operating when it does.
          </p>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
            {whatDies.map((row) => (
              <div
                key={row.holds}
                className="border-l-2 border-conviction/30 pl-5"
              >
                <p className="text-base font-medium text-bone">If they hold {row.holds.replace(/^Your /, "your ")}</p>
                <p className="mt-1 text-base leading-relaxed text-bone/60">
                  {row.dies}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The audit process */}
      <section id="process" className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            How The Audit Works
          </p>
          <h2 className="mb-10 text-[28px] font-medium text-bone">
            Three steps. The plan is yours either way.
          </h2>
          <div className="space-y-10">
            {auditSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="grid gap-6 md:grid-cols-[60px_1fr]">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-medium text-conviction/40">
                      {i + 1}
                    </span>
                    <Icon className="mt-2 h-5 w-5 text-conviction" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-bone">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-bone/60">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="mt-12 border border-conviction/20 bg-slate-brand/20 p-6"
            style={{ borderRadius: "2px" }}
          >
            <p className="text-base leading-relaxed text-bone/70">
              <span className="font-medium text-bone">The plan is yours.</span>{" "}
              Take it home, hand it to your existing IT, or hire us to
              implement. There&apos;s no ongoing engagement gating the
              document. You walk in not knowing what you don&apos;t own; you
              walk out with a list and a plan, regardless of what happens next.
            </p>
          </div>
        </div>
      </section>

      {/* Sample questions */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Sample Questions
          </p>
          <h2 className="mb-4 text-[28px] font-medium text-bone">
            A few of the questions we&apos;ll ask.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-bone/60">
            If you can answer most of these without checking, you&apos;re ahead
            of most businesses. If you can&apos;t answer them, that&apos;s
            normal — and exactly what the audit fixes.
          </p>
          <ul className="space-y-3">
            {examples.map((q) => (
              <li
                key={q}
                className="flex items-start gap-3 text-base leading-relaxed text-bone/70"
              >
                <Key className="mt-1 h-4 w-4 shrink-0 text-conviction/70" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Internal IT — where domain knowledge lives */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Where Domain Knowledge Lives
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Past a certain size, every business should have internal IT.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-bone/60">
            <p>
              The person who knows that the POS terminals reboot every Tuesday
              at 3am. The one who remembers why you picked that specific email
              setup. The one your warehouse manager actually trusts. That
              person doesn&apos;t work for an MSP. They work for you.
            </p>
            <p>
              Domain knowledge of <em>your</em> business lives with internal
              staff. External providers (us included) rebuild that
              understanding every time we touch something. An internal IT
              person — even one — keeps the institutional memory in the
              building.
            </p>
            <p>
              We&apos;re not here to replace your internal IT. We&apos;re here
              to make them capable on Apple, hand them the keys, and back them
              up when they need it. If you don&apos;t have internal IT yet, we
              can also help you scope the role and hire for it.
            </p>
          </div>
          <p className="pt-2 text-sm text-bone/40">
            See also:{" "}
            <Link
              href="/services"
              className="underline underline-offset-2 hover:text-conviction"
            >
              Mac Management Training for Windows Teams
            </Link>{" "}
            — our service for internal IT teams that know Windows but need to manage Apple.
          </p>
        </div>
      </section>

      {/* Principles — what we won't do */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Where We Stand
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            MSPs aren&apos;t the problem. The lock-in pattern is.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-bone/60">
            <p>
              Most MSPs are good people working inside a business model that
              rewards confusion. The vendor markups, the multi-year contracts,
              the RMM agents that are hard to remove — those are structural,
              not personal. We don&apos;t paint individual operators as
              villains.
            </p>
            <p>
              What we do is refuse to build our own offering on top of those
              same patterns:
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: ShieldOff,
                title: "No RMM agents",
                body: "We manage Apple devices through MDM, which already lives on the device. No extra agent, no extra attack surface, no extra thing to remove if you leave us.",
              },
              {
                icon: ShieldOff,
                title: "No vendor markup",
                body: "Vendor costs pass through at cost. You see the invoice. We never bake margin into someone else's product line.",
              },
              {
                icon: ShieldOff,
                title: "No long contracts",
                body: "Month-to-month after a 3-month onboarding. The onboarding minimum exists because doing this right takes time. After that, you stay because it works — not because you're locked in.",
              },
              {
                icon: ShieldOff,
                title: "No knowledge hoarding",
                body: "Every system we touch gets documented. Your team gets the docs. If we get hit by a bus, your business keeps running.",
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="space-y-2 border-l-2 border-conviction/30 pl-5"
                >
                  <Icon className="h-4 w-4 text-conviction" strokeWidth={1.5} />
                  <h3 className="text-base font-medium text-bone">{p.title}</h3>
                  <p className="text-base leading-relaxed text-bone/60">{p.body}</p>
                </div>
              );
            })}
          </div>
          <p className="pt-4 text-base leading-relaxed text-bone/60">
            You can keep your existing MSP, your existing IT person, your
            existing vendors. You don&apos;t need to use us to fix this. We
            just want every small business owner to know what they should
            own — and to be able to walk away from any vendor on their
            timeline, ours included.
          </p>

          <div
            className="mt-8 border-l-2 border-conviction/30 pl-5 text-base leading-relaxed text-bone/60"
          >
            <p className="font-medium text-bone">
              This isn&apos;t for everyone — and that&apos;s fine.
            </p>
            <p className="mt-2">
              If what you want is one number per month and to never think
              about your IT again, that&apos;s a legitimate model. It just
              isn&apos;t ours. We work with people who want to understand
              what they own. The principles above — published rates, no
              markup, no lock-in, no knowledge hoarding — mean we&apos;ll
              cost you a small amount of attention up front. Some prospects
              would rather not. We&apos;d rather lose those than dilute what
              we do for the ones we&apos;re built to serve.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Ready to find out what you don&apos;t own?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Book a free consultation. We&apos;ll walk through the checklist
          together. You&apos;ll leave with a clearer picture of what&apos;s in
          your name and what isn&apos;t — even if you never hire us.
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
