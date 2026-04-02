// app/support/page.tsx
export const dynamic = "force-dynamic";

import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SupportForm } from "@/components/site/support-form";
import { db } from "@/server/db";

export const metadata = {
  title: "Support",
  description:
    "Submit a support ticket — no account needed. We respond same business day for retainer clients.",
  alternates: { canonical: "https://akritos.com/support" },
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "Akritos";
  } catch {
    return "Akritos";
  }
}

export default async function SupportPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Support
          </p>
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-bone">Get support</h1>
          <p className="mb-8 text-bone/50">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
            You&apos;ll receive a ticket number by email — no account needed.
          </p>

          <SupportForm />
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
