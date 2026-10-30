import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Boxer Rankings",
  description:
    "View NBDABA boxer rankings and competitive standings for athletes competing in North Bombay and Mumbai.",
  path: "/rankings",
  image: "/rankings/rankings-hero.png",
  imageAlt: "NBDABA boxer rankings",
});

export default function RankingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
