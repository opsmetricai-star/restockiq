import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "RestockIQ: AI-native inventory and replenishment planning",
  description:
    "RestockIQ is the AI planning engine that forecasts demand, optimizes inventory and automates replenishment for retailers, wholesalers and manufacturers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
