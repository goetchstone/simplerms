// app/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { LogoMark } from "@/components/brand/logo-mark";
import { db } from "@/server/db";
import {
  ArrowRight,
  Shield,
  MonitorSmartphone,
  Server,
  CreditCard,
  Globe,
  Users,
  Handshake,
  Lock,
} from "lucide-react";

async function getCompanyName() {
  try {
    const setting = await db.setting.findUnique({ where: { key: "company_name" } });
    return setting?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

const services = [
  {
    icon: MonitorSmartphone,
    title: "Apple Business & MDM",
    body: "Apple Business setup, the right MDM for your team — Mosyle, Jamf, Kandji — chosen for fit, not kickbacks. We don't take partnership revenue. Your stack, your choice.",
  },
  {
    icon: Server,
    title: "Infrastructure & Hardware",
    body: "The right hardware for the job. Mac, networking, storage — spec'd correctly, owned outright. No hardware-as-a-service traps.",
  },
  {
    icon: Shield,
    title: "PCI Compliance",
    body: "Payment card industry compliance done right. We walk you through every requirement, connect you with the right payment processor, and make sure you pass — not just on paper.",
  },
  {
    icon: Globe,
    title: "Workspace & Domain",
    body: "Google Workspace, Microsoft 365, DNS, email — set up correctly from day one. You own the domain, you own the accounts, you have the keys.",
  },
  {
    icon: CreditCard,
    title: "Vendor & Payment Stack",
    body: "Payment terminals, processors, gateways — we help you pick vendors who don't lock you in and don't gouge on fees. We negotiate on your behalf.",
  },
  {
    icon: Users,
    title: "Virtual CTO",
    body: "Ongoing technology leadership without the six-figure salary. We sit in on the decisions that matter, flag the risks you don't see, and keep your technology honest.",
  },
  {
    icon: Handshake,
    title: "Co-Management",
    body: "Already have IT staff? We augment, not replace. Your team handles the day-to-day. We handle the hard stuff — architecture, compliance, vendor negotiations.",
  },
  {
    icon: Lock,
    title: "Security & Compliance",
    body: "Endpoint protection, access controls, compliance audits. We make sure your business is protected from threats and from vendors who profit from your fear.",
  },
];

const values = [
  {
    heading: "You own your technology",
    body: "No lock-in. Ever. If we disappeared tomorrow, you'd still have everything. Your domains, your accounts, your infrastructure — yours.",
  },
  {
    heading: "We tell you the truth",
    body: "If you're about to make a bad decision, we'll say so. We'd rather lose the engagement than let you walk into something you'll regret.",
  },
  {
    heading: "Everything is divorceable",
    body: "Every vendor we recommend, every tool we deploy, every partnership we build — you can walk away from any of it, including us. That's the point.",
  },
  {
    heading: "The P is Partner",
    body: "We're not a managed service provider. We're a managed service partner. Providers extract value. Partners create it. The distinction matters to us.",
  },
];

export default async function HomePage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pb-24 pt-32 text-center">
        <LogoMark size={64} color="#C8A96E" className="mb-6" />
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
          Technology Partners
        </p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl lg:text-[56px] lg:leading-tight">
          Your business is living in confusion.
          <br />
          <span className="text-conviction">We end it.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/60">
          Locked into vendors who profit from your dependency. Overwhelmed by
          technology decisions designed to confuse you. We partner with small
          businesses to build technology they own — and tell them the truth
          even when it&apos;s hard to hear.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

      {/* Origin Story */}
      <section className="border-t border-bone/10 bg-slate-brand/30 px-6 py-24">
        <div className="mx-auto max-w-[720px] space-y-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            The Name
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Akritos means confused.
          </h2>
          <p className="text-base leading-relaxed text-bone/60">
            From the Ancient Greek <em>akritos</em> — confused, undecided,
            indiscriminate. When we asked AI what it meant, it gave us the
            opposite: &ldquo;precise, exact.&rdquo; We liked the sound of it
            and ran with the name. Then we looked it up ourselves.
          </p>
          <p className="text-base leading-relaxed text-bone/60">
            Turns out the real meaning was better. Because that&apos;s exactly
            what our clients are before they find us — confused, locked in,
            overwhelmed, dependent on vendors who profit from that confusion.
            <em>Akritos</em> isn&apos;t what we are. It&apos;s what we fix.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              What We Do
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              Technology consulting that leaves you independent
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
              Every service we offer is designed with one goal: you own it, you
              control it, you can walk away from any vendor — including us.
            </p>
          </div>
          <div className="grid gap-px bg-bone/5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-midnight p-8 transition-colors hover:bg-slate-brand/20"
                >
                  <Icon className="mb-4 h-5 w-5 text-conviction" strokeWidth={1.5} />
                  <h3 className="mb-2 text-sm font-medium text-bone">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-bone/50">{s.body}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-conviction hover:text-conviction/80"
            >
              See all services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Break */}
      <section className="relative h-[400px] w-full overflow-hidden">
        {/* Unsplash: small business team working together */}
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          alt="Team collaborating around a table"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-midnight/70" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <blockquote className="max-w-2xl text-center">
            <p className="text-2xl font-medium leading-relaxed text-bone sm:text-3xl">
              &ldquo;We don&apos;t profit from your confusion.
              We profit when you don&apos;t need us anymore.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              How We Work
            </p>
            <h2 className="text-[28px] font-medium text-bone">
              These aren&apos;t marketing words
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
              They&apos;re the rules we make every decision by. We publish them
              because you should be able to hold us to them.
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.heading} className="space-y-3 border-l-2 border-conviction/30 pl-6">
                <h3 className="text-base font-medium text-bone">{v.heading}</h3>
                <p className="text-sm leading-relaxed text-bone/50">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Fair Pricing
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Published rates. No surprises.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-bone/50">
            We believe you should know what something costs before you commit.
            Our rates are public, our invoices are clear, and we don&apos;t
            bill for problems we created.
          </p>
          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              style={{ borderRadius: "2px" }}
            >
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-medium text-bone">Ready to end the confusion?</h2>
          <p className="mt-4 text-bone/50">
            Book a free initial consultation. We&apos;ll tell you what we see,
            what it would cost to fix, and whether we&apos;re the right fit.
            No sales pitch. No obligation.
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
              href="/support"
              className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
              style={{ borderRadius: "2px" }}
            >
              Open a support ticket
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
