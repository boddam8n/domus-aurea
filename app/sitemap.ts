import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://domus-aurea.vercel.app").replace(/\/$/, "");
  return ["", "/templates", "/design", "/pricing", "/gallery", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
