// components/site/public-only.tsx
"use client";

import { usePathname } from "next/navigation";

// Signed-in and token-bearing routes. Analytics reports the full page URL, so
// rendering it here would ship reset, portal, and ticket-tracking tokens to a
// third party.
const PRIVATE_PREFIXES = [
  "/dashboard",
  "/portal",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/support/track",
];

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return isPrivate ? null : children;
}
