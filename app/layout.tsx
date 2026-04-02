// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Akritos — Technology Partners for Small Business",
    template: "%s | Akritos",
  },
  description:
    "Technology consulting that leaves you independent. Apple Business, MDM, compliance, e-commerce, infrastructure — published rates, zero vendor markup, no lock-in.",
  metadataBase: new URL("https://akritos.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Akritos",
    title: "Akritos — Technology Partners for Small Business",
    description:
      "We fix the confusion. Published rates, zero vendor markup, no lock-in. Technology consulting that leaves you more independent than we found you.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akritos — Technology Partners for Small Business",
    description:
      "Technology consulting that leaves you independent. Published rates, zero vendor markup, no lock-in.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://akritos.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-background font-sans text-foreground">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
