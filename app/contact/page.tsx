// app/contact/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SupportForm } from "@/components/site/support-form";
import { db } from "@/server/db";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Akritos. Based in Connecticut, serving CT, MA, RI, and the NYC metro. Call (860) 934-3410 or email gstone@akritos.com.",
  alternates: { canonical: "https://akritos.com/contact" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

export default async function ContactPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-[900px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Contact
          </p>
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-bone">
            Let&apos;s talk
          </h1>
          <p className="mb-12 text-bone/50">
            Reach out directly or send a message below. No sales funnel, no
            chatbot — you&apos;re talking to a real person.
          </p>

          <div className="grid gap-12 md:grid-cols-[1fr_320px]">
            {/* Form */}
            <div>
              <h2 className="mb-4 text-sm font-medium text-bone">
                Send a message
              </h2>
              <SupportForm />
            </div>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-sm font-medium text-bone">
                  Direct
                </h2>
                <div className="space-y-4">
                  <a
                    href="tel:+18609343410"
                    className="flex items-start gap-3 text-sm text-bone/60 hover:text-conviction"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                    <div>
                      <p className="font-medium text-bone">(860) 934-3410</p>
                    </div>
                  </a>
                  <a
                    href="mailto:gstone@akritos.com"
                    className="flex items-start gap-3 text-sm text-bone/60 hover:text-conviction"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                    <div>
                      <p className="font-medium text-bone">
                        gstone@akritos.com
                      </p>
                      <p className="text-xs text-bone/40">
                        General inquiries: info@akritos.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-sm text-bone/60">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-conviction/60" />
                    <div>
                      <p className="font-medium text-bone">
                        18 Pine Tree Rd
                      </p>
                      <p>Moodus, CT 06469</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-medium text-bone">
                  Service area
                </h2>
                <p className="text-sm leading-relaxed text-bone/50">
                  Based in Connecticut. On-site service throughout Connecticut,
                  Massachusetts, and Rhode Island. NYC metro by arrangement.
                  Remote support available everywhere.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-medium text-bone">
                  Free consultation
                </h2>
                <p className="text-sm leading-relaxed text-bone/50">
                  Not sure what you need? Book a free 30-minute call. I&apos;ll
                  tell you what I see, what it would cost, and whether
                  I&apos;m the right fit.{" "}
                  <a
                    href="/book"
                    className="text-conviction underline underline-offset-2"
                  >
                    Book now →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
