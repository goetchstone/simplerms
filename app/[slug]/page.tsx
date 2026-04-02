// app/[slug]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { db } from "@/server/db";

interface Props {
  params: Promise<{ slug: string }>;
}

const RESERVED = new Set(["about", "book", "contact", "privacy", "terms", "support", "blog", "portal", "dashboard", "api", "pricing", "services"]);

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
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-3xl">
          <h1 className="mb-8 text-3xl font-medium tracking-tight text-bone">{page.title}</h1>
          <div className="prose-invert prose prose-sm max-w-none prose-headings:text-bone prose-p:text-bone/60 prose-a:text-conviction">
            <BlockRenderer blocks={page.content as unknown as Parameters<typeof BlockRenderer>[0]["blocks"]} />
          </div>
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
