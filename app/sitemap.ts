// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/server/db";

const BASE = "https://akritos.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/services`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE}/ownership`, changeFrequency: "weekly", priority: 0.98 },
  { url: `${BASE}/recommended-vendors`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE}/apple-business`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE}/ai-risk`, changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/book`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/support`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/nonprofits`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/careers`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Pull published blog posts and CMS pages so the sitemap reflects what's live.
  // Fail open: if DB is unreachable, ship the static routes alone.
  let posts: { slug: string; updatedAt: Date }[] = [];
  let pages: { slug: string; updatedAt: Date }[] = [];
  try {
    [posts, pages] = await Promise.all([
      db.cmsPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.cmsPage.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB unavailable; static routes still ship
  }

  return [
    ...STATIC_ROUTES.map((r) => ({ ...r, lastModified: now })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...pages.map((p) => ({
      url: `${BASE}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
