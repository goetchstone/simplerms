// components/blog/share-buttons.tsx
import { Share2, Link as LinkIcon } from "lucide-react";

interface Props {
  url: string;
  title: string;
}

// Server component — no JS, just intent URLs that open the platform's share dialog.
// Lucide v1 dropped brand icons; labels do the identification work.
export function ShareButtons({ url, title }: Props) {
  const encoded = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
  };

  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`;
  const xHref = `https://x.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`;

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-bone/10 pt-6">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-bone/40">
        <Share2 className="h-3.5 w-3.5" /> Share
      </span>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-bone/20 px-3 py-1.5 text-xs text-bone/60 transition-colors hover:border-conviction hover:text-conviction"
        style={{ borderRadius: "2px" }}
      >
        LinkedIn
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-bone/20 px-3 py-1.5 text-xs text-bone/60 transition-colors hover:border-conviction hover:text-conviction"
        style={{ borderRadius: "2px" }}
      >
        X
      </a>
      <a
        href={url}
        className="inline-flex items-center gap-2 border border-bone/20 px-3 py-1.5 text-xs text-bone/60 transition-colors hover:border-conviction hover:text-conviction"
        style={{ borderRadius: "2px" }}
      >
        <LinkIcon className="h-3.5 w-3.5" /> Permalink
      </a>
    </div>
  );
}
