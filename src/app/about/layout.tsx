import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About the Association",
  description:
    "Learn about NBDABA's mission to develop grassroots boxing talent, support athletes, and strengthen affiliated clubs across North Bombay and Mumbai.",
  path: "/about",
  image: "/about/about-hero.png",
  imageAlt: "About the North Bombay District Amateur Boxing Association",
});

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
