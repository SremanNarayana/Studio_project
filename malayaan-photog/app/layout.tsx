import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SITE_URL, BUSINESS, KEYWORDS, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Malayaan Photography — Best Wedding Photographer in Madurai, Melur & Tamil Nadu",
    template: "%s | Malayaan Photography",
  },
  description:
    "Award-winning wedding, candid, pre-wedding, maternity, baby & event photography across Madurai, Melur, Chennai, Tirunelveli, Kanyakumari, Kodaikanal and all over Tamil Nadu. ★ 5.0 from 38+ happy couples. Capturing emotions, creating timeless memories.",
  keywords: KEYWORDS,
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  alternates: { canonical: "/" },
  category: "Photography",
  openGraph: {
    title:
      "Malayaan Photography — Best Wedding Photographer in Madurai & Tamil Nadu",
    description:
      "Premium wedding, pre-wedding, maternity & event photography across Madurai, Melur, Chennai, Tirunelveli, Kanyakumari, Kodaikanal and all of Tamil Nadu. ★ 5.0 rated.",
    url: SITE_URL,
    siteName: BUSINESS.name,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Malayaan Photography — Tamil Nadu Wedding Photographers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malayaan Photography — Best Wedding Photographer in Tamil Nadu",
    description:
      "Premium wedding & portrait photography across Madurai, Melur, Chennai & all of Tamil Nadu. ★ 5.0 rated.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  verification: {
    // Paste your Google Search Console token here once verified:
    // google: "your-google-site-verification-token",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="grain bg-ink-950 text-ivory-100">
        <ScrollProgress />
        <Navigation />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
