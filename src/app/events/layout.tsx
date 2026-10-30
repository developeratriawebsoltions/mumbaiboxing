import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Boxing Events and Tournaments",
  description:
    "Browse North Bombay District Amateur Boxing Association events, tournament schedules, locations, and registration information.",
  path: "/events",
  image: "/home/hero-bg-desktop.png",
  imageAlt: "NBDABA boxing events and tournaments",
});

export default function EventsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
