import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://btechcareerhub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${APP_URL}/resources`, changeFrequency: "daily", priority: 0.8 },
    { url: `${APP_URL}/placements`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/placements/dsa-roadmap`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${APP_URL}/placements/resume-templates`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/placements/interview-questions`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const examRoutes: MetadataRoute.Sitemap = exams.map((e) => ({
    url: `${APP_URL}/exam/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...examRoutes];
}
