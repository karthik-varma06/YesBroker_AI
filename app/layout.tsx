import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "YesBroker AI | Enterprise AI Real Estate Platform",
  description:
    "Enterprise-grade AI operating system for modern real estate. Voice agents, negotiation engine, and intelligent marketplace in one platform.",
  keywords: ["AI real estate", "enterprise platform", "voice agent", "property AI", "Dubai real estate AI"],
  openGraph: {
    title: "YesBroker AI | Enterprise AI Real Estate Platform",
    description: "Enterprise-grade AI operating system for modern real estate.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Google Fonts — Inter + Space Grotesk */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen"
        style={{ background: "#050816", color: "#F8FAFC" }}
        suppressHydrationWarning
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
