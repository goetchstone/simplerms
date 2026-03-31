// app/book/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { BookingFlow } from "@/components/site/booking-flow";
import { db } from "@/server/db";
import { Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
  const [setting, service] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.service.findUnique({
      where: { slug, isActive: true, isPublic: true },
    }),
  ]);
  return { companyName: setting?.value ?? "SimpleRMS", service };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { service } = await getData(slug);
  if (!service) return {};
  return { title: `Book: ${service.name}`, description: service.description ?? undefined };
}

export default async function BookServicePage({ params }: Props) {
  const { slug } = await params;
  const { companyName, service } = await getData(slug);

  if (!service) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          {/* Service header */}
          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{service.name}</h1>
            {service.description && (
              <p className="text-zinc-500">{service.description}</p>
            )}
            <div className="flex items-center gap-4 pt-1 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {service.duration} min
              </span>
              {service.price !== null && (
                <span>{formatCurrency(Number(service.price), "CAD")}</span>
              )}
            </div>
          </div>

          <BookingFlow serviceId={service.id} serviceName={service.name} />
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
