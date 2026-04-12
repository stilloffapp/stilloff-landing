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
  title: "StillOff — Stop Checking Your Phone Constantly",
  description: "A real-time intervention for compulsive phone use. StillOff helps you stop checking your phone constantly by locking you into a guided reset before the loop takes over.",
  keywords: ["phone addiction app", "stop doomscrolling", "compulsive phone use", "digital detox app", "reduce screen time", "app blocker for phone addiction", "screen addiction app", "break phone scrolling habit", "screen time intervention", "behavioral intervention app"],
  metadataBase: new URL("https://stilloff.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "StillOff — Stop Checking Your Phone Constantly",
    description: "A real-time intervention for compulsive phone use. StillOff helps you stop checking your phone constantly by locking you into a guided reset before the loop takes over.",
    url: "https://stilloff.com",
    siteName: "StillOff",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StillOff — Stop Checking Your Phone Constantly",
    description: "Real-time intervention for compulsive phone use. A guided reset before the loop takes over.",
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
