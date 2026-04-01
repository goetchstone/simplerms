// app/[slug]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { db } from "@/server/db";

// Dynamic CMS pages — anything not matched by a static route falls here.
// Slugs like /about, /services, /privacy etc.

interface Props {
  params: Promise<{ slug: string }>;
}

// Slugs that are handled by other routes — don't claim them.
const RESERVED = new Set(["book", "support", "blog", "portal", "dashboard", "api"]);

async function getData(slug: string) {
  const [setting, page] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.cmsPage.findUnique({ where: { slug, status: "PUBLISHED" } }),
  ]);
  return { companyName: setting?.value ?? "Akritos", page };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { page } = await getData(slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDesc ?? undefined,
  };
}

export default async function CmsPageRoute({ params }: Props) {
  const { slug } = await params;

  if (RESERVED.has(slug)) notFound();

  const { companyName, page } = await getData(slug);
  if (!page) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-3xl">
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900">{page.title}</h1>
          <BlockRenderer blocks={page.content as unknown as Parameters<typeof BlockRenderer>[0]["blocks"]} />
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
