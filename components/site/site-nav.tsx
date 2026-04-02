// components/site/site-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/logo-mark";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book", label: "Book a session" },
  { href: "/support", label: "Support" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav({ companyName = "Akritos" }: { companyName?: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-midnight/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={24} color="#C8A96E" />
          <span className="text-sm font-medium tracking-[0.2em] text-bone">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(l.href)
                  ? "font-medium text-conviction"
                  : "text-bone/60 hover:text-bone"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/dashboard"
          className="border border-bone/20 px-3 py-1.5 text-sm text-bone/60 transition-colors hover:border-conviction hover:text-conviction"
          style={{ borderRadius: "2px" }}
        >
          Staff login
        </Link>
      </div>
    </header>
  );
}
