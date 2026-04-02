// proxy.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/book",
  "/support",
  "/pricing",
  "/services",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/api/auth",
  "/api/trpc",
  "/api/webhooks",
  "/api/health",
];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/(site)") ||
    pathname === "/";

  if (isPublic) return NextResponse.next();

  // Portal routes accept either a session or a ?token= query param.
  if (pathname.startsWith("/portal")) {
    const token = req.nextUrl.searchParams.get("token");
    if (token) return NextResponse.next();
  }

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
