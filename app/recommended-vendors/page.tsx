// app/recommended-vendors/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { ArrowRight, ExternalLink } from "lucide-react";

const SITE_URL = "https://akritos.com";
const URL = `${SITE_URL}/recommended-vendors`;
const TITLE = "Vendors We Recommend";
const DESCRIPTION =
  "We don't take kickbacks. We don't mark up prices. So when we recommend a vendor, you can trust we picked them because they fit — not because they pay us. Updated regularly.";

// Update this when you do a real review pass
const LAST_REVIEWED = "May 2026";

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

interface Pick {
  name: string;
  url: string;
  why: string;
  caveats?: string;
}

interface Category {
  title: string;
  intro: string;
  picks: Pick[];
  avoid?: { name: string; why: string }[];
}

const CATEGORIES: Category[] = [
  {
    title: "Networking",
    intro:
      "Cloud-managed wireless and routing without per-port licensing fees that brick your hardware when you stop paying.",
    picks: [
      {
        name: "Ubiquiti UniFi",
        url: "https://ui.com",
        why: "Cloud-managed via Cloud Key OR self-hosted controller — your choice. No recurring license fees on core gear. Hardware keeps working if you stop paying anything. Decent enterprise feature set (VLANs, RADIUS, multi-site).",
        caveats:
          "Supply chain has been rough the past 2 years; manage expectations on lead times. Buy from B&H Photo or Streakwave (authorized resellers, MAP-enforced pricing — same price everywhere).",
      },
      {
        name: "Juniper Mist",
        url: "https://www.juniper.net/us/en/products/cloud-services/wireless.html",
        why: "Less lock-in than Aruba or Meraki. AI-driven cloud management. Genuinely capable. The right pick for clients with 50+ APs and real SLA needs.",
        caveats: "Enterprise pricing. Overkill for a 10-person office.",
      },
      {
        name: "Omada (TP-Link)",
        url: "https://www.tp-link.com/us/business-networking/omada-sdn/",
        why: "UniFi-like cloud management at lower price. Less polished but transparent and cheap. Decent for the budget tier (5-10 person offices, simple needs).",
      },
    ],
    avoid: [
      {
        name: "Cisco Meraki",
        why: "Hardware bricks if you stop paying license fees. The textbook example of perpetual extraction.",
      },
      {
        name: "Aruba Central",
        why: "HPE keeps tightening licensing. Powerful but increasingly extractive.",
      },
    ],
  },
  {
    title: "Domain registrar & DNS",
    intro:
      "Where your domain lives matters more than people realize. The wrong registrar can hold your domain hostage for weeks during a transfer.",
    picks: [
      {
        name: "Cloudflare Registrar + DNS",
        url: "https://www.cloudflare.com/products/registrar/",
        why: "At-cost domain pricing (no markup). One-click transfer out. Free DNS bundled. Free WAF on the basic plan. The clearest no-lock-in option in the entire stack.",
      },
      {
        name: "Porkbun",
        url: "https://porkbun.com",
        why: "Transparent pricing, no upsells, easy UI for non-technical users. A good Cloudflare alternative if you want a different vendor for redundancy.",
      },
      {
        name: "Namecheap",
        url: "https://www.namecheap.com",
        why: "Solid mid-tier, occasional upsells but honest. Familiar to most people.",
      },
    ],
    avoid: [
      {
        name: "GoDaddy / Network Solutions / Web.com",
        why: "Predatory upselling, hostile UX, expensive renewals. Just don't.",
      },
    ],
  },
  {
    title: "Email & Workspace",
    intro:
      "Your business email is your identity layer. The vendor who controls the super-admin role controls everything that depends on email — which is most of your stack.",
    picks: [
      {
        name: "Google Workspace",
        url: "https://workspace.google.com",
        why: "Clean export paths, strong APIs, the ecosystem most SMBs already understand. Identity federation works smoothly with Apple Business.",
      },
      {
        name: "Microsoft 365",
        url: "https://www.microsoft.com/en-us/microsoft-365/business",
        why: "Right pick if your client lives in Office. Same export and federation strengths as Google. Pair with Apple Business for Mac shops.",
      },
      {
        name: "Fastmail",
        url: "https://www.fastmail.com",
        why: "IMAP-first, fully portable, independently owned. The best pick for clients who want email without the data-mining concerns of Google.",
      },
      {
        name: "Proton Mail",
        url: "https://proton.me/business",
        why: "Privacy-first. Easy migration in. Good for small clients with confidentiality concerns. Limited admin features for larger teams.",
      },
    ],
  },
  {
    title: "Cloud hosting & VMs",
    intro:
      "When clients need server compute (web apps, custom backends, internal tools), the right pick depends on technical literacy and budget.",
    picks: [
      {
        name: "DigitalOcean",
        url: "https://www.digitalocean.com",
        why: "Simplest 'I need a VM' answer for most SMB clients. $6/mo droplets, transparent pricing, well-documented. Cheaper than AWS Lightsail for the same spec. Managed databases, Spaces (S3-compatible), App Platform if you want PaaS.",
      },
      {
        name: "Hetzner Cloud",
        url: "https://www.hetzner.com/cloud",
        why: "Cheaper than DigitalOcean by ~50% for similar specs. EU-based servers. Best for technical clients who want maximum value per dollar and don't need US data residency.",
      },
      {
        name: "Vercel",
        url: "https://vercel.com",
        why: "Specifically for Next.js / React apps. Free tier is generous for small sites. Easy out — you can self-host the standalone Next build elsewhere whenever you want.",
      },
      {
        name: "DreamHost DreamCompute",
        url: "https://www.dreamhost.com/cloud/computing/",
        why: "OpenStack-based VMs. What Akritos itself runs on. US-based, decent support, portable underneath the panel.",
        caveats:
          "Their shared hosting and DreamPress (managed WordPress) can be slow and overpriced. Stick to DreamCompute if you go with them.",
      },
    ],
    avoid: [
      {
        name: "Heroku",
        why: "Salesforce-owned, proprietary buildpacks, killed the free tier. The cautionary tale for what happens after acquisition.",
      },
    ],
  },
  {
    title: "Managed WordPress",
    intro:
      "If a client wants WordPress without managing the server, here are the picks that don't price-gouge.",
    picks: [
      {
        name: "Cloudways",
        url: "https://www.cloudways.com",
        why: "Managed WordPress on top of DigitalOcean or AWS, $14-27/mo. Reasonable pricing, easy migration in/out, good performance.",
      },
      {
        name: "Kinsta",
        url: "https://kinsta.com",
        why: "Premium managed WordPress. Expensive ($35+/mo) but legitimately good. Worth it for high-traffic sites.",
      },
    ],
    avoid: [
      {
        name: "DreamPress",
        why: "Overpriced for what you get. Underpowered for medium-traffic sites.",
      },
    ],
  },
  {
    title: "Backups & object storage",
    intro:
      "Backups that live with your IT provider die with your IT provider. Independent storage with S3-compatible APIs is the right shape.",
    picks: [
      {
        name: "Backblaze B2",
        url: "https://www.backblaze.com/cloud-storage",
        why: "S3-compatible API, transparent pricing ($6/TB/month), no egress traps within their network. Treat it as commodity storage.",
      },
      {
        name: "Wasabi",
        url: "https://wasabi.com",
        why: "Same model as Backblaze. Slightly different pricing structure (no egress fees up to 100% of storage). Good for write-once-read-rarely backup patterns.",
      },
    ],
    avoid: [
      {
        name: "Carbonite, IDrive",
        why: "Proprietary backup formats. Hard to leave. Restore process can require their software.",
      },
    ],
  },
  {
    title: "Password managers",
    intro:
      "Whoever controls the org owner role on the password manager controls every credential you've shared. Make sure that's you.",
    picks: [
      {
        name: "1Password",
        url: "https://1password.com/business",
        why: "Clean JSON/CSV export, business-friendly admin, good shared vault model. The default for most SMB IT.",
      },
      {
        name: "Bitwarden",
        url: "https://bitwarden.com/products/business/",
        why: "Open source, self-host option for clients who want full control. Same export quality as 1Password. Cheaper.",
      },
      {
        name: "Proton Pass",
        url: "https://proton.me/pass/business",
        why: "Newer but solid. Good if the client is already in the Proton ecosystem.",
      },
    ],
    avoid: [
      {
        name: "LastPass",
        why: "Multiple major breaches. Sketchy ownership history. Migrate clients off it.",
      },
    ],
  },
  {
    title: "Apple device management (MDM)",
    intro:
      "For Apple-heavy environments. Built-in MDM via Apple Business is enough for most small businesses; enterprise MDM is for when it isn't.",
    picks: [
      {
        name: "Apple Business",
        url: "https://www.apple.com/business/",
        why: "Free, built into the platform, owned by Apple by definition. The right pick for most small businesses running Apple devices. We help set this up.",
      },
      {
        name: "Mosyle",
        url: "https://mosyle.com/business",
        why: "Transparent pricing, no markup games, real partner program (Mosyle Partner) for IT providers. The right pick when Apple Business isn't enough.",
      },
    ],
    avoid: [],
  },
  {
    title: "Payments & POS",
    intro:
      "Payment processing has the highest hidden-cost surface in your stack. Markup, percentage fees, lock-in via integrated POS hardware.",
    picks: [
      {
        name: "Stripe",
        url: "https://stripe.com",
        why: "Well-documented APIs, easy export, payment links work standalone, transparent pricing. The default for online and software-driven payments.",
      },
      {
        name: "Square",
        url: "https://squareup.com",
        why: "Simplest in-person POS. Transparent fees, easy onboarding. Reasonable for retail and food service.",
      },
    ],
    avoid: [
      {
        name: "Toast / Lightspeed / Clover (proprietary hardware)",
        why: "Proprietary hardware + sticky software + percentage-based pricing = the worst lock-in we see. Custom hardware tied to specific contracts.",
      },
    ],
  },
  {
    title: "Marketing email & CRM",
    intro:
      "Email lists are owned by whoever stores them. Pick a vendor that exports cleanly.",
    picks: [
      {
        name: "Brevo (formerly Sendinblue)",
        url: "https://www.brevo.com",
        why: "Pay-as-you-go pricing, easy export, SMTP + transactional email + marketing in one. The best value at SMB scale.",
      },
      {
        name: "HubSpot Free / Starter",
        url: "https://www.hubspot.com",
        why: "Generous free tier, easy export. Becomes expensive at scale; plan to migrate before you grow into the higher tiers.",
      },
      {
        name: "Mailchimp",
        url: "https://mailchimp.com",
        why: "Easy export, broad familiarity. Intuit-owned now and pricing has gotten less friendly. Don't lead with it.",
      },
    ],
    avoid: [
      {
        name: "HighLevel and other 'agency white-label' platforms",
        why: "Marketing agencies trap clients here. When you fire the agency, you lose access to the platform — which often holds your contacts, automations, and analytics.",
      },
    ],
  },
  {
    title: "Accounting",
    intro:
      "Pick based on bookkeeper familiarity. All of these export cleanly.",
    picks: [
      {
        name: "Wave",
        url: "https://www.waveapps.com",
        why: "Free for invoicing and accounting. Reasonable for tiny businesses. Easy export.",
      },
      {
        name: "Xero",
        url: "https://www.xero.com",
        why: "Global, easy export, strong API. Better than QuickBooks for tech-forward clients.",
      },
      {
        name: "QuickBooks Online",
        url: "https://quickbooks.intuit.com",
        why: "Universal — every CPA in the US knows it. Export paths exist via third-party tools.",
      },
    ],
  },
  {
    title: "Phones & VoIP",
    intro:
      "VoIP is a common lock-in surface (port-out fees, hostage hardware). Pick something that ports cleanly.",
    picks: [
      {
        name: "PBXact Cloud (Sangoma)",
        url: "https://sangoma.com/products/business-communications/pbxact/",
        why: "Built on FreePBX (open source) — exit path exists. Sangoma has a partner/reseller program. Right pick for businesses that need real PBX features (IVR, queues, call routing).",
      },
      {
        name: "OpenPhone",
        url: "https://www.openphone.com",
        why: "Modern, simple, clean port-out. Right pick for 1-15 person businesses that just want a number that works.",
      },
      {
        name: "Self-hosted FreePBX",
        url: "https://www.freepbx.org",
        why: "For technical clients who want full ownership. Pair with a SIP trunk provider like Twilio or Telnyx.",
      },
    ],
    avoid: [
      {
        name: "Most MSP-managed VoIP",
        why: "Port-out fees, hostage hardware, opaque billing. Common lock-in pattern.",
      },
    ],
  },
  {
    title: "Analytics",
    intro:
      "Web analytics that respect users and let you export your data.",
    picks: [
      {
        name: "Plausible",
        url: "https://plausible.io",
        why: "Privacy-respecting, lightweight script, no cookie banner needed in EU/CA, full data export. The right pick if you care about brand alignment with privacy.",
      },
      {
        name: "Umami",
        url: "https://umami.is",
        why: "Open source, self-hostable, privacy-respecting. Right pick for clients who want full control over the analytics data.",
      },
      {
        name: "Google Analytics 4",
        url: "https://marketingplatform.google.com/about/analytics/",
        why: "Free, Google owns the data. Useful if the client already lives in Google Ads. We use it ourselves with that trade-off acknowledged.",
      },
    ],
  },
];

export default async function RecommendedVendorsPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      {/* Hero */}
      <section className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Recommended Vendors
          </p>
          <h1 className="text-4xl font-medium tracking-[0.01em] text-bone sm:text-5xl">
            We don&apos;t take kickbacks.
            <br />
            <span className="text-conviction">We don&apos;t mark up prices.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone/60">
            Most consultants won&apos;t publish their preferred vendors —
            because they take referral fees or markup from at least half of
            them. We can&apos;t. So when we recommend a vendor below, you can
            trust we picked them because they fit, not because they pay us.
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-bone/60">
            This list is opinionated. We update it regularly. If a vendor on it
            shifts their pricing or business model in a way that breaks the
            promise, we move them off — and we tell you why.
          </p>
          <div className="mt-8 text-xs text-bone/40">Last reviewed: {LAST_REVIEWED}</div>
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <section
          key={cat.title}
          className="border-t border-bone/10 px-6 py-16 odd:bg-slate-brand/20"
        >
          <div className="mx-auto max-w-[1000px]">
            <h2 className="mb-3 text-[24px] font-medium text-bone">{cat.title}</h2>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-bone/60">
              {cat.intro}
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              {cat.picks.map((pick) => (
                <div
                  key={pick.name}
                  className="border-l-2 border-conviction/30 pl-5"
                >
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-baseline gap-1.5 text-base font-medium text-bone hover:text-conviction"
                  >
                    {pick.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="mt-2 text-base leading-relaxed text-bone/60">
                    {pick.why}
                  </p>
                  {pick.caveats && (
                    <p className="mt-2 text-sm leading-relaxed text-bone/40">
                      <span className="font-medium text-bone/60">Caveats: </span>
                      {pick.caveats}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {cat.avoid && cat.avoid.length > 0 && (
              <div className="mt-10 border border-conviction/10 bg-midnight p-5" style={{ borderRadius: "2px" }}>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-bone/40">
                  We avoid
                </p>
                <ul className="space-y-2">
                  {cat.avoid.map((a) => (
                    <li key={a.name} className="text-sm leading-relaxed text-bone/50">
                      <span className="font-medium text-bone/70">{a.name}</span>{" "}
                      — {a.why}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* The migration math */}
      <section className="border-t border-bone/10 px-6 py-24">
        <div className="mx-auto max-w-[800px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            The Honest Math
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            Switching vendors costs real money. Sometimes it&apos;s not worth it.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-bone/60">
            <p>
              Migrating a client from a bad vendor to a good one usually takes
              5-20 hours of consulting time. At $225/hr that&apos;s
              $1,125-$4,500. If the &quot;better&quot; vendor saves the client
              $50/month, the migration takes 2-7 years to pay back.
            </p>
            <p>
              Our default recommendation: pick the right vendor for{" "}
              <span className="font-medium text-bone">new</span> setups,
              migrate existing ones only when there&apos;s a triggering event
              — the vendor is being hostile, the contract is ending, the
              system needs replacing anyway, or the lock-in risk justifies the
              cost (e.g., critical service in a vendor that just got acquired
              by PE).
            </p>
            <p>
              The Vendor Independence Audit identifies what you&apos;d gain
              from migrating each piece — including the honest cost — so you
              can prioritize. We don&apos;t push migrations that don&apos;t
              pay back.
            </p>
          </div>
        </div>
      </section>

      {/* When this list is wrong */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24">
        <div className="mx-auto max-w-[800px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            When This List Is Wrong
          </p>
          <h2 className="text-[28px] font-medium text-bone">
            We update it. You should question it.
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-bone/60">
            <p>
              Vendor landscapes change. A company that was reasonable last year
              gets acquired by private equity and pivots to extraction.
              Pricing models tighten. APIs that used to be free get
              deprecated. We try to stay current and update this list quarterly.
            </p>
            <p>
              If you&apos;re evaluating a vendor not on this list — or you
              think one we recommend has shifted — bring it to a
              consultation. We&apos;ll tell you what we&apos;ve seen, what
              we don&apos;t know, and what we&apos;d need to research before
              giving you a real recommendation.
            </p>
            <p>
              We&apos;re not paid by anyone on this list. No referral
              programs. No partner discount kickbacks (when we get a partner
              discount, we pass it through to you). If a vendor here changes
              that calculation, we&apos;ll move them off and explain why.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bone/10 bg-slate-brand/20 px-6 py-24 text-center">
        <h2 className="text-2xl font-medium text-bone">
          Need help choosing for your specific situation?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Book a free consultation. We&apos;ll walk through your current
          stack, identify which vendors are working and which aren&apos;t,
          and give you concrete alternatives — even if you never hire us to
          implement them.
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
            href="/ownership"
            className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Get the Vendor Independence Audit
          </Link>
        </div>
      </section>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
