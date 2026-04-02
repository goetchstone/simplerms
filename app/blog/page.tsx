// app/blog/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { db } from "@/server/db";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Blog | Akritos", description: "Insights and updates from our team." };

async function getData() {
  const [setting, posts] = await Promise.all([
    db.setting.findUnique({ where: { key: "company_name" } }),
    db.cmsPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true },
    }),
  ]);
  return { companyName: setting?.value ?? "Akritos", posts };
}

export default async function BlogPage() {
  const { companyName, posts } = await getData();

  return (
    <div className="flex min-h-dvh flex-col bg-midnight">
      <SiteNav companyName={companyName} />

      <main className="flex flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-conviction">
            Blog
          </p>
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-bone">
            Insights and updates
          </h1>
          <p className="mb-10 text-bone/50">Thoughts from our team — no fluff, no filler.</p>

          {posts.length === 0 ? (
            <p className="py-12 text-center text-bone/30">No posts yet. Check back soon.</p>
          ) : (
            <div className="divide-y divide-bone/10">
              {posts.map((post) => (
                <article key={post.slug} className="py-8 first:pt-0">
                  <Link href={`/blog/${post.slug}`} className="group block space-y-2">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="mb-4 h-48 w-full object-cover"
                        style={{ borderRadius: "2px" }}
                      />
                    )}
                    <h2 className="text-xl font-medium text-bone group-hover:text-conviction">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-bone/50 leading-relaxed">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-bone/30">
                      <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                      <span className="flex items-center gap-1 font-medium text-conviction">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter companyName={companyName} />
    </div>
  );
}
