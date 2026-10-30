import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Boxing Academies",
  description:
    "Discover boxing academies affiliated with NBDABA across North Bombay and Mumbai, and find local training opportunities for athletes.",
  path: "/academies",
  image: "/home/hero-bg-desktop.png",
  imageAlt: "Boxing training with NBDABA",
});

export default function AcademiesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
