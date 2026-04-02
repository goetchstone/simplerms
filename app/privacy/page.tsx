// app/privacy/page.tsx
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Akritos collects, uses, and protects your information.",
  alternates: { canonical: "https://akritos.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <article className="w-full max-w-[680px] space-y-8">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
              Legal
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-bone">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-bone/40">
              Last updated: April 2026
            </p>
          </div>

          <Section title="Who we are">
            Akritos is a technology consulting firm based in Moodus,
            Connecticut, operated by Goetch Stone. This policy describes how we
            handle information collected through our website at akritos.com.
          </Section>

          <Section title="What we collect">
            We collect only what you voluntarily provide:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Contact forms &amp; support tickets:</strong> name,
                email, phone (optional), and the content of your message.
              </li>
              <li>
                <strong>Booking:</strong> name, email, phone (optional), and
                appointment details.
              </li>
              <li>
                <strong>Client portal:</strong> account email and information
                you provide as part of our working relationship.
              </li>
            </ul>
          </Section>

          <Section title="What we don't collect">
            <ul className="list-disc space-y-1 pl-5">
              <li>No third-party analytics or tracking scripts</li>
              <li>No advertising cookies</li>
              <li>No selling or sharing of your data with third parties</li>
              <li>No behavioral tracking or profiling</li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc space-y-1 pl-5">
              <li>To respond to your inquiry or support request</li>
              <li>To confirm and manage appointments</li>
              <li>
                To deliver services you&apos;ve engaged us for
              </li>
              <li>
                To send invoices and service-related communications
              </li>
            </ul>
            We do not send marketing emails unless you explicitly opt in.
          </Section>

          <Section title="How we protect your information">
            All data is transmitted over HTTPS. Application data is stored in
            encrypted databases. API keys and credentials are encrypted at rest
            using AES-256-GCM. Access to client data is restricted to
            authorized team members only.
          </Section>

          <Section title="Data retention">
            We retain your information for as long as necessary to provide our
            services. Contact form submissions are retained for 12 months.
            Client data is retained for the duration of our working
            relationship plus 3 years for legal and tax purposes.
          </Section>

          <Section title="Your rights">
            You may request at any time:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>A copy of all data we hold about you</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your data</li>
            </ul>
            Contact us at{" "}
            <a
              href="mailto:gstone@akritos.com"
              className="text-conviction underline underline-offset-2"
            >
              gstone@akritos.com
            </a>{" "}
            to make a request.
          </Section>

          <Section title="Changes to this policy">
            We may update this policy as our practices evolve. Material changes
            will be noted with an updated date at the top of this page.
          </Section>

          <Section title="Contact">
            Questions about this policy? Reach us at{" "}
            <a
              href="mailto:gstone@akritos.com"
              className="text-conviction underline underline-offset-2"
            >
              gstone@akritos.com
            </a>{" "}
            or call (860) 934-3410.
          </Section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-bone">{title}</h2>
      <div className="text-sm leading-relaxed text-bone/60">{children}</div>
    </section>
  );
}
