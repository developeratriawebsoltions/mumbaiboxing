import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import PublicSiteChrome from "@/Components/layout/PublicSiteChrome";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "North Bombay District Amateur Boxing Association",
    template: "%s | NBDABA",
  },
  description:
    "North Bombay District Amateur Boxing Association (NBDABA) — Developing grassroots boxing talent and strengthening the boxing community.",
  applicationName: SITE_NAME,
  keywords: [
    "North Bombay boxing",
    "Mumbai boxing association",
    "boxing tournaments Mumbai",
    "boxing academies Mumbai",
    "NBDABA",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "North Bombay District Amateur Boxing Association",
    description:
      "Developing grassroots boxing talent and strengthening the boxing community in North Bombay and Mumbai.",
    url: "/",
    images: [
      {
        url: "/home/hero-bg-desktop.png",
        alt: "Boxing at the North Bombay District Amateur Boxing Association",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "North Bombay District Amateur Boxing Association",
    description:
      "Developing grassroots boxing talent and strengthening the boxing community in North Bombay and Mumbai.",
    images: [
      {
        url: "/home/hero-bg-desktop.png",
        alt: "Boxing at the North Bombay District Amateur Boxing Association",
      },
    ],
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
  icons: {
    icon: [
      {
        url: "/logo/Favicon/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/logo/Favicon/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/logo/Favicon/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/logo/Favicon/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/logo/Favicon/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/logo/Favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/logo/Favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${bebasNeue.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SportsOrganization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  alternateName: "NBDABA",
                  url: SITE_URL,
                  logo: `${SITE_URL}/logo/Favicon/android-chrome-512x512.png`,
                  sport: "Boxing",
                  description:
                    "The North Bombay District Amateur Boxing Association supports grassroots boxing, athlete development, academies, and competitions in Mumbai, Maharashtra.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Mumbai",
                    addressRegion: "Maharashtra",
                    addressCountry: "IN",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  publisher: { "@id": `${SITE_URL}/#organization` },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
        <PublicSiteChrome>{children}</PublicSiteChrome>
      </body>
    </html>
  );
}