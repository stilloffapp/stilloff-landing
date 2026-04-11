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
  title: "StillOff — When discipline disappears, StillOff steps in.",
  description: "StillOff is a real-time intervention app for compulsive phone use, designed to interrupt doomscrolling and guide users into a reset before the loop deepens.",
  keywords: ["phone addiction app", "stop doomscrolling", "compulsive phone use", "digital detox app", "reduce screen time", "app blocker for phone addiction", "screen addiction app", "break phone scrolling habit"],
  openGraph: {
    title: "StillOff — When discipline disappears, StillOff steps in.",
    description: "The first real-time intervention for compulsive phone use.",
    url: "https://stilloff.com",
    siteName: "StillOff",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StillOff — When discipline disappears, StillOff steps in.",
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
