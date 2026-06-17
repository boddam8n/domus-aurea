import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://domus-aurea.example";
  return ["", "/templates", "/design", "/pricing", "/gallery", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
