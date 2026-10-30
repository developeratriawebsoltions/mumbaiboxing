import type { Metadata } from "next";

export const SITE_NAME =
  "North Bombay District Amateur Boxing Association (NBDABA)";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nbdaba.org"
).replace(/\/+$/, "");

export function createPageMetadata({
  title,
  description,
  path,
  image = "/home/hero-bg-desktop.png",
  imageAlt = "North Bombay District Amateur Boxing Association",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: SITE_NAME,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
