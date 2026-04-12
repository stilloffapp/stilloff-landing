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
  description: "StillOff is a real-time behavioral intervention for compulsive phone use. It steps in before the spiral takes over — guided breathing, app lock, soft landing.",
  keywords: ["phone addiction app", "stop doomscrolling", "compulsive phone use", "digital detox app", "reduce screen time", "app blocker for phone addiction", "screen addiction app", "break phone scrolling habit", "screen time intervention", "behavioral intervention app"],
  metadataBase: new URL("https://stilloff.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "StillOff — When you can't stop, StillOff does.",
    description: "A real-time intervention that steps in before the spiral takes over. Not a blocker — a guided reset.",
    url: "https://stilloff.com",
    siteName: "StillOff",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StillOff — When you can't stop, StillOff does.",
    description: "Real-time behavioral intervention for compulsive phone use.",
    creator: "@stilloff",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  );
}
