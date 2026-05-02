// components/site/analytics.tsx
// Provider-agnostic analytics renderer. Reads provider + site ID from Settings
// at request time so the founder can switch providers in the dashboard without
// a code change. Renders nothing if either value is missing.

import Script from "next/script";
import { db } from "@/server/db";

async function getAnalyticsConfig() {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: ["analytics_provider", "analytics_site_id"] } },
      select: { key: true, value: true },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      provider: map.analytics_provider?.toLowerCase() ?? "",
      siteId: map.analytics_site_id ?? "",
    };
  } catch {
    return { provider: "", siteId: "" };
  }
}

export async function Analytics() {
  const { provider, siteId } = await getAnalyticsConfig();
  if (!provider || !siteId) return null;

  if (provider === "ga4") {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${siteId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${siteId}');`}
        </Script>
      </>
    );
  }

  if (provider === "plausible") {
    return (
      <Script
        src="https://plausible.io/js/script.js"
        data-domain={siteId}
        strategy="afterInteractive"
        defer
      />
    );
  }

  if (provider === "umami") {
    // Umami requires both site ID and the script src; site ID is the data-website-id.
    // Self-hosted users should set NEXT_PUBLIC_UMAMI_SRC if their script lives elsewhere.
    const src = process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";
    return (
      <Script src={src} data-website-id={siteId} strategy="afterInteractive" defer />
    );
  }

  return null;
}
