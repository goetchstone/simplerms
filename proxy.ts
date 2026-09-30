// proxy.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  // Only logged-out users need these; the mutations behind them are already
  // public and rate-limited via /api/trpc.
  "/forgot-password",
  "/reset-password",
  "/book",
  "/support",
  "/pricing",
  "/services",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/nonprofits",
  "/careers",
  "/apple-business",
  "/ai-risk",
  "/ownership",
  "/portal",
  "/api/auth",
  "/api/trpc",
  "/api/webhooks",
  "/api/health",
  "/api/tickets/reply",
  "/api/leads/checklist",
  "/api/leads/prompt-framework",
  "/api/leads/tech-debt",
  "/api/tools/dmarc-check",
  "/resources",
  "/tools",
];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Whole-segment match: a bare prefix check would silently make a future
  // "/bookkeeping" public because "/book" is listed.
  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPublic) return NextResponse.next();

  if (!(req as { auth: unknown }).auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
