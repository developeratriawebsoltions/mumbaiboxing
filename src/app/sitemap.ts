import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const publicRoutes = [
  "",
  "/about",
  "/academies",
  "/contact",
  "/events",
  "/governance",
  "/grievance",
  "/news",
  "/privacy-policy",
  "/rankings",
  "/sitemap",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" || path === "/events" || path === "/news" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/events" || path === "/news" ? 0.8 : 0.6,
  }));
}
