// app/support/page.tsx
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SupportForm } from "@/components/site/support-form";
import { db } from "@/server/db";

export const metadata = {
  title: "Support | SimpleRMS",
  description: "Submit a support ticket. No account needed.",
};

async function getCompanyName() {
  try {
    const s = await db.setting.findUnique({ where: { key: "company_name" } });
    return s?.value ?? "SimpleRMS";
  } catch {
    return "SimpleRMS";
  }
}

export default async function SupportPage() {
  const companyName = await getCompanyName();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-xl">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">Get support</h1>
          <p className="mb-8 text-zinc-500">
            Fill out the form below and we'll get back to you as soon as possible.
            You'll receive a ticket number by email so you can track your request — no account needed.
          </p>

          <SupportForm />
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
