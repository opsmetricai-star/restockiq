import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "RestockIQ: AI-native inventory & replenishment planning",
  description:
    "RestockIQ is a unified, AI-native planning platform for retailers, wholesalers and manufacturers: forecast demand, optimize inventory and automate replenishment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
