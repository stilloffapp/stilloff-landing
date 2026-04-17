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
  title: "StillOff — The Real-Time Intervention for Compulsive Phone Use",
  description:
    "StillOff is a 60-second breathing lock that interrupts compulsive phone use the moment it starts. Not a blocker. Not a timer. A real-time intervention that works when willpower doesn't.",
  keywords: [
    "phone addiction intervention",
    "stop compulsive phone checking",
    "phone addiction app",
    "stop doomscrolling",
    "compulsive phone use help",
    "digital detox app",
    "reduce screen time",
    "phone anxiety relief",
    "break phone scrolling habit",
    "screen time intervention",
    "mindful phone use app",
    "phone addiction breathing exercise",
    "stop phone spiral",
    "phone use blocker alternative",
    "behavioral intervention app",
    "phone detox breathing lock",
    "stilloff app",
  ],
  metadataBase: new URL("https://stilloff.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "StillOff — When You Can't Stop, StillOff Does.",
    description:
      "A 60-second breathing lock that interrupts compulsive phone use in real time. The first intervention that works when willpower doesn't. Join the waitlist.",
    url: "https://stilloff.com",
    siteName: "StillOff",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StillOff — When You Can't Stop, StillOff Does.",
    description:
      "A 60-second breathing lock that interrupts compulsive phone use in real time. Not a blocker. Not a timer. A real-time intervention.",
    creator: "@stilloff",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "StillOff",
        url: "https://stilloff.com",
        description:
          "StillOff is a real-time intervention for compulsive phone use — a 60-second breathing lock that interrupts the spiral the moment it starts.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@stilloff.com",
          contactType: "customer support",
        },
      },
      {
        "@type": "WebApplication",
        name: "StillOff",
        url: "https://stilloff.com",
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS, Android",
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            name: "Free Plan",
          },
          {
            "@type": "Offer",
            price: "5.99",
            priceCurrency: "USD",
            name: "Plus Plan",
            billingIncrement: 1,
            unitCode: "MON",
          },
          {
            "@type": "Offer",
            price: "9.99",
            priceCurrency: "USD",
            name: "Premium Plan",
            billingIncrement: 1,
            unitCode: "MON",
          },
        ],
        description:
          "A 60-second breathing lock that interrupts compulsive phone use in real time. Not a blocker — an intervention.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is StillOff?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StillOff is a real-time intervention for compulsive phone use. When you pick up your phone compulsively, StillOff steps in with a 60-second guided breathing lock — replacing the spiral with a moment of stillness.",
            },
          },
          {
            "@type": "Question",
            name: "How is StillOff different from screen time apps?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Screen time apps track usage or block apps on a schedule. StillOff intervenes in the moment — when compulsive behavior is already happening. It doesn't rely on your willpower or discipline. It removes the decision entirely.",
            },
          },
          {
            "@type": "Question",
            name: "What is the 60-second breathing lock?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "When StillOff detects compulsive phone use, it locks your phone into a guided breathing exercise for 60 seconds. Your screen becomes a calm, dark space with gentle breathing prompts. After the lock lifts, there's a soft landing period to help you make a different choice.",
            },
          },
          {
            "@type": "Question",
            name: "Is StillOff free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StillOff offers a free plan with 3 resets per day. The Plus plan ($5.99/mo) includes the full system with unlimited resets, The Lock, and Soft Landing. Premium ($9.99/mo) adds advanced features for deeper recovery.",
            },
          },
          {
            "@type": "Question",
            name: "When does StillOff launch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StillOff is currently in pre-launch. Join the waitlist to be first when it launches. You'll receive one email when it's ready — no newsletters, no spam.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
