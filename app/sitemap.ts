import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/shop", 0.9, "daily"),
    ...categories.map((c) => page(`/shop/${c.id}`, 0.8, "daily")),
    ...products.map((p) => ({
      ...page(`/shop/${p.category}/${p.slug}`, 0.7, "weekly"),
      images: [`${SITE_URL}${p.image}`],
    })),
    page("/repairs", 0.7, "monthly"),
    page("/about", 0.5, "monthly"),
    page("/contact", 0.5, "monthly"),
    page("/returns", 0.3, "monthly"),
    page("/terms", 0.2, "monthly"),
    page("/privacy", 0.2, "monthly"),
  ];
}
