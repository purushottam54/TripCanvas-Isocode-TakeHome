import { MetadataRoute } from "next";
import { getPublishedPackages } from "@/lib/db/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const packages = await getPublishedPackages();

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${siteUrl}/packages/${pkg.slug}`,
    lastModified: new Date(pkg.updatedAt || pkg.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/enquire`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...packageRoutes];
}
