import type { MetadataRoute } from "next";
import { FEATURED_TEAMS } from "@/config/matches.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai-match-companion.vercel.app";

  const teamUrls = FEATURED_TEAMS.map((team) => ({
    url: `${baseUrl}/team/${team.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...teamUrls,
  ];
}
