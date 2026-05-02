// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { db } from "@/server/db";

export const runtime = "nodejs";
export const alt = "Akritos blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const post = await db.cmsPost.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  });

  const title = post?.title ?? "Akritos";
  const excerpt = post?.excerpt ?? "Apple device management, simplified.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#1C1F2E",
          color: "#E8E4DC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#C8A96E",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C8A96E",
            }}
          >
            Akritos
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div style={{ fontSize: 28, color: "rgba(232, 228, 220, 0.6)", lineHeight: 1.4 }}>
              {excerpt.length > 140 ? excerpt.slice(0, 137) + "…" : excerpt}
            </div>
          )}
        </div>

        <div style={{ fontSize: 20, color: "rgba(232, 228, 220, 0.4)" }}>akritos.com</div>
      </div>
    ),
    size,
  );
}
