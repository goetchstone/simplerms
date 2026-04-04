// components/cms/block-renderer.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Block {
  type: "heading" | "paragraph" | "image" | "divider" | "cta";
  content?: string;
  level?: number;
  src?: string;
  alt?: string;
  ctaText?: string;
  ctaHref?: string;
}

const headingSizes: Record<number, string> = {
  1: "text-3xl font-semibold",
  2: "text-2xl font-semibold",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold",
};

function HeadingBlock({ content = "", level = 2 }: Block) {
  const cls = `${headingSizes[level] ?? headingSizes[2]} mt-8 mb-3 tracking-tight text-bone`;
  if (level === 1) return <h1 className={cls}>{content}</h1>;
  if (level === 3) return <h3 className={cls}>{content}</h3>;
  if (level === 4) return <h4 className={cls}>{content}</h4>;
  if (level === 5) return <h5 className={cls}>{content}</h5>;
  if (level === 6) return <h6 className={cls}>{content}</h6>;
  return <h2 className={cls}>{content}</h2>;
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return <HeadingBlock key={i} {...block} />;

          case "paragraph":
            return (
              <p key={i} className="my-4 text-base leading-relaxed text-bone/80">
                {block.content}
              </p>
            );

          case "image":
            return block.src ? (
              <img
                key={i}
                src={block.src}
                alt={block.alt ?? ""}
                className="my-6 w-full object-cover"
                style={{ borderRadius: "2px" }}
              />
            ) : null;

          case "divider":
            return <hr key={i} className="my-8 border-bone/10" />;

          case "cta":
            return (
              <div key={i} className="my-8 border border-conviction/20 bg-slate-brand/20 p-6 text-center" style={{ borderRadius: "2px" }}>
                {block.content && (
                  <p className="mb-4 text-bone/70">{block.content}</p>
                )}
                {block.ctaHref && (
                  <Link
                    href={block.ctaHref}
                    className="inline-flex items-center gap-2 bg-conviction px-5 py-2.5 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
                    style={{ borderRadius: "2px" }}
                  >
                    {block.ctaText ?? "Learn more"} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
