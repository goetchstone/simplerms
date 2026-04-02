// components/site/site-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/logo-mark";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({ companyName = "Akritos" }: { companyName?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-midnight/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={24} color="#C8A96E" />
          <span className="text-sm font-medium tracking-[0.2em] text-bone">
            {companyName}
          </span>
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden border border-bone/20 px-3 py-1.5 text-sm text-bone/60 transition-colors hover:border-conviction hover:text-conviction md:inline-block"
            style={{ borderRadius: "2px" }}
          >
            Staff login
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center text-bone/60 hover:text-bone md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-bone/10 bg-midnight px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm transition-colors ${
                  pathname.startsWith(l.href)
                    ? "font-medium text-conviction"
                    : "text-bone/60 hover:text-bone"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 border-t border-bone/10 pt-4 text-sm text-bone/40 hover:text-conviction"
            >
              Staff login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
