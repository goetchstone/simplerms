// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { BlockRenderer } from "@/components/cms/block-renderer";
import { db } from "@/server/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
  const [setting, post] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.cmsPost.findUnique({ where: { slug, status: "PUBLISHED" } }),
  ]);
  return { companyName: setting?.value ?? "SimpleRMS", post };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { post } = await getData(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { companyName, post } = await getData(slug);
  if (!post) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ChevronLeft className="h-4 w-4" /> All posts
          </Link>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="mb-8 h-56 w-full rounded-xl object-cover"
            />
          )}

          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">{post.title}</h1>
          {post.publishedAt && (
            <p className="mb-8 text-sm text-zinc-400">{formatDate(post.publishedAt)}</p>
          )}

          <BlockRenderer blocks={post.content as unknown as Parameters<typeof BlockRenderer>[0]["blocks"]} />
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
