import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["", "/templates", "/design", "/pricing", "/romance", "/romance/create", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
