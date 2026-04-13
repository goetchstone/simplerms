// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

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
            `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://images.unsplash.com",
            `connect-src 'self' https://js.stripe.com${isDev ? " ws://localhost:*" : ""}`,
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
