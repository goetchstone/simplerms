// app/terms/page.tsx
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Akritos website and services.",
  alternates: { canonical: "https://akritos.com/terms" },
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-bone/40">
              Last updated: April 2026
            </p>
          </div>

          <Section title="Agreement">
            By using akritos.com, you agree to these terms. If you don&apos;t
            agree, don&apos;t use the site. Simple as that.
          </Section>

          <Section title="What this site is">
            This website provides information about Akritos&apos;s technology
            consulting services, allows you to book consultations, submit
            support requests, and access client tools. It is operated by Goetch
            Stone, based in Moodus, Connecticut.
          </Section>

          <Section title="Consultations and advice">
            Information provided during consultations — including free initial
            consultations — represents our professional opinion based on the
            information available to us at the time. It is not a guarantee of
            outcome. Technology decisions carry inherent risk, and we encourage
            you to make informed decisions based on multiple sources.
          </Section>

          <Section title="Service agreements">
            Paid engagements are governed by a separate Master Service Agreement
            (MSA) and Statement of Work (SOW) signed by both parties. These
            website terms do not replace or modify any signed service agreement.
          </Section>

          <Section title="Pricing">
            Published rates on this site are current as of the date shown. Rates
            may change. Any rate changes will not affect work already contracted
            under a signed agreement. Vendor costs referenced on this site are
            estimates — actual vendor pricing depends on your specific
            configuration and the vendor&apos;s current rates.
          </Section>

          <Section title="Your data">
            See our{" "}
            <a
              href="/privacy"
              className="text-conviction underline underline-offset-2"
            >
              Privacy Policy
            </a>{" "}
            for how we handle your information.
          </Section>

          <Section title="Intellectual property">
            The Akritos name, logo, and website content are the property of
            Akritos. You may not reproduce, distribute, or create derivative
            works from this content without written permission.
          </Section>

          <Section title="Limitation of liability">
            To the maximum extent permitted by law, Akritos shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of this website or our services. Our
            total liability for any claim shall not exceed the amount you paid
            us in the 12 months preceding the claim.
          </Section>

          <Section title="Governing law">
            These terms are governed by the laws of the State of Connecticut.
            Any disputes shall be resolved in the courts of Connecticut.
          </Section>

          <Section title="Changes">
            We may update these terms. Continued use of the site after changes
            constitutes acceptance. Material changes will be noted with an
            updated date.
          </Section>

          <Section title="Contact">
            Questions?{" "}
            <a
              href="mailto:gstone@akritos.com"
              className="text-conviction underline underline-offset-2"
            >
              gstone@akritos.com
            </a>{" "}
            or (860) 934-3410.
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
