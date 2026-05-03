// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Analytics provider script + connect endpoints. We allow all three providers
// the Settings UI exposes (GA4, Plausible, Umami) so the founder can switch
// without redeploying CSP. Each domain set is small and well-scoped.
const ANALYTICS_SCRIPT = [
  "https://www.googletagmanager.com",
  "https://plausible.io",
  "https://cloud.umami.is",
].join(" ");

const ANALYTICS_CONNECT = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.analytics.google.com",
  "https://plausible.io",
  "https://cloud.umami.is",
].join(" ");

const ANALYTICS_IMG = [
  "https://www.google-analytics.com",
].join(" ");

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            // React dev mode requires unsafe-eval for error overlay stack traces.
            // Analytics providers (GA4 / Plausible / Umami) load scripts cross-origin.
            `script-src 'self' 'unsafe-inline' ${ANALYTICS_SCRIPT}${isDev ? " 'unsafe-eval'" : ""}`,
            "style-src 'self' 'unsafe-inline'",
            `img-src 'self' data: blob: https://images.unsplash.com ${ANALYTICS_IMG}`,
            `connect-src 'self' https://js.stripe.com ${ANALYTICS_CONNECT}${isDev ? " ws://localhost:*" : ""}`,
            "font-src 'self'",
            "frame-src https://js.stripe.com",
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
