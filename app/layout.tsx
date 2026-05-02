// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCProvider } from "@/lib/trpc/provider";
import { Analytics } from "@/components/site/analytics";
import { db } from "@/server/db";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

const TITLE = "Akritos — Technology Partners for Small Business";
const DESCRIPTION =
  "Technology consulting that leaves you independent. Apple Business, MDM, infrastructure, e-commerce — published rates, zero vendor markup, no lock-in.";

async function getVerification() {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: ["google_site_verification", "bing_site_verification"] } },
      select: { key: true, value: true },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      google: map.google_site_verification || undefined,
      bing: map.bing_site_verification || undefined,
    };
  } catch {
    return { google: undefined, bing: undefined };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const v = await getVerification();
  return {
    title: { default: TITLE, template: "%s | Akritos" },
    description: DESCRIPTION,
    metadataBase: new URL("https://akritos.com"),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Akritos",
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
    robots: { index: true, follow: true },
    alternates: { canonical: "https://akritos.com" },
    verification: {
      google: v.google,
      ...(v.bing && { other: { "msvalidate.01": v.bing } }),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-background font-sans text-foreground">
        <TRPCProvider>{children}</TRPCProvider>
        {/* Analytics is provider-agnostic and noop when settings are unset */}
        <Analytics />
      </body>
    </html>
  );
}
