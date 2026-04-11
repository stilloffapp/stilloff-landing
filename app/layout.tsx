import type { Metadata } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const serif = Cormorant({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "StillOff — When you can't stop, StillOff does.",
  description: "Real-time intervention for compulsive phone use.",
  keywords: ["compulsive phone use", "stop checking phone", "phone addiction", "digital detox", "doomscrolling", "how to stop checking my ex instagram", "anxiety phone use", "screen time intervention"],
  openGraph: {
    title: "StillOff — When you can't stop, StillOff does.",
    description: "When you can't stop, StillOff does.",
    url: "https://stilloff.com",
    siteName: "StillOff",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StillOff — When you can't stop, StillOff does.",
    description: "Real-time intervention for compulsive phone use.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  );
}
