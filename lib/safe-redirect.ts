// lib/safe-redirect.ts

// Resolving against the real origin and comparing origins catches every
// off-site form a prefix check misses: "//host", "/\host" (browsers read "\"
// as "/"), tab/newline-split slashes, and absolute or javascript: URLs.
export function safeRedirectPath(raw: string | null, origin: string, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  try {
    const url = new URL(raw, origin);
    if (url.origin !== origin) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
