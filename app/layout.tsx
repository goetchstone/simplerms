// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Akritos",
  description: "Business management for consultancies.",
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
