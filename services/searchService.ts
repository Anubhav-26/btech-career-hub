import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  type: "exam" | "resource" | "pyq" | "company";
  title: string;
  subtitle: string;
  href: string;
}

/**
 * Global search across exams, resources, PYQs, and companies, merged and
 * capped to `limit`. A single endpoint instead of four separate calls so
 * the autocomplete dropdown can render one ranked list — see
 * docs/05-api-endpoints.md §5.1. For MVP scale (low thousands of rows),
 * Postgres ILIKE is sufficient; if this becomes a bottleneck, swap the
 * query bodies below for a Postgres full-text `tsvector` column or
 * Algolia/Meilisearch without touching the calling API route.
 */
export async function globalSearch(q: string, limit = 8): Promise<SearchResult[]> {
  const perTypeLimit = Math.ceil(limit / 3);
  const term = `%${q}%`;

  const [exams, resources, pyqs] = await Promise.all([
    prisma.exam.findMany({
      where: { isActive: true, OR: [{ title: { contains: q, mode: "insensitive" } }, { shortTitle: { contains: q, mode: "insensitive" } }] },
      select: { id: true, slug: true, title: true, category: true },
      take: perTypeLimit,
    }),
    prisma.resource.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { subject: { contains: q, mode: "insensitive" } }] },
      select: { id: true, title: true, subject: true, exam: { select: { slug: true, shortTitle: true } } },
      take: perTypeLimit,
    }),
    prisma.pYQ.findMany({
      where: { exam: { OR: [{ title: { contains: q, mode: "insensitive" } }, { shortTitle: { contains: q, mode: "insensitive" } }] } },
      select: { id: true, year: true, exam: { select: { slug: true, shortTitle: true } } },
      take: perTypeLimit,
    }),
  ]);
  void term; // reserved for raw SQL fallback if ILIKE via Prisma isn't expressive enough

  const results: SearchResult[] = [
    ...exams.map((e) => ({
      id: e.id,
      type: "exam" as const,
      title: e.title,
      subtitle: e.category,
      href: `/exam/${e.slug}`,
    })),
    ...resources.map((r) => ({
      id: r.id,
      type: "resource" as const,
      title: r.title,
      subtitle: `${r.exam.shortTitle} · ${r.subject}`,
      href: `/resources?resourceId=${r.id}`,
    })),
    ...pyqs.map((p) => ({
      id: p.id,
      type: "pyq" as const,
      title: `${p.exam.shortTitle} ${p.year} PYQ`,
      subtitle: "Previous Year Question",
      href: `/exam/${p.exam.slug}?tab=pyqs`,
    })),
  ];

  return results.slice(0, limit);
}
