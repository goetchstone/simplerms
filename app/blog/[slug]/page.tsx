// app/blog/[slug]/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { db } from "@/server/db";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://akritos.com";

async function getData(slug: string) {
  const [setting, post] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.cmsPost.findUnique({ where: { slug, status: "PUBLISHED" } }),
  ]);
  return { companyName: setting?.value ?? "Akritos", post };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getData(slug);
  if (!post) return {};

  // OG/Twitter images are produced by app/blog/[slug]/opengraph-image.tsx and
  // auto-discovered by Next.js. coverImage, when present, takes precedence.
  const url = `${SITE_URL}/blog/${slug}`;
  const description = post.excerpt ?? undefined;
  const explicitImage = post.coverImage ? [post.coverImage] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      ...(explicitImage && { images: explicitImage }),
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Goetch Stone"],
      siteName: "Akritos",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(explicitImage && { images: explicitImage }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { companyName, post } = await getData(slug);
  if (!post) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <JsonLd data={articleSchema({ ...post, description: post.excerpt })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${slug}` },
        ])}
      />
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <article className="w-full max-w-2xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1 text-sm text-bone/40 hover:text-conviction"
          >
            <ChevronLeft className="h-4 w-4" /> All posts
          </Link>

          {post.coverImage && (
            <div className="relative mb-8 h-56 w-full overflow-hidden" style={{ borderRadius: "2px" }}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="mb-2 text-3xl font-medium tracking-tight text-bone">{post.title}</h1>
          {post.publishedAt && (
            <p className="mb-8 text-sm text-bone/30">
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            </p>
          )}

          <div className="prose-invert prose prose-base max-w-none prose-headings:text-bone prose-p:text-bone/80 prose-a:text-conviction">
            <BlockRenderer blocks={post.content as unknown as Parameters<typeof BlockRenderer>[0]["blocks"]} />
          </div>
        </article>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
