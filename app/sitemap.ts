import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["", "/templates", "/design", "/pricing", "/gallery", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
