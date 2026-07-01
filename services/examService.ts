import { prisma } from "@/lib/prisma";
import type { Branch, ExamCategory } from "@prisma/client";

/**
 * All Prisma queries for Exam live here, not inline in route handlers or
 * pages — see docs/03-folder-structure.md §3.1 for why. This lets the
 * same "list exams" logic be called from a Server Component, an API
 * route, and the sitemap generator without duplicating query shape.
 */

export async function listExams(filters: {
  category?: ExamCategory;
  branch?: Branch;
  isActive?: boolean;
}) {
  return prisma.exam.findMany({
    where: {
      category: filters.category,
      branch: filters.branch,
      isActive: filters.isActive ?? true,
    },
    orderBy: { title: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortTitle: true,
      category: true,
      branch: true,
      coverImageUrl: true,
      examDate: true,
      applicationDeadline: true,
    },
  });
}

export async function getExamBySlug(slug: string) {
  return prisma.exam.findUnique({
    where: { slug },
    include: {
      faqs: { orderBy: { order: "asc" } },
      cutoffs: { orderBy: { year: "desc" } },
      companies: { include: { company: true } },
      roadmaps: { include: { steps: { orderBy: { order: "asc" } } } },
      _count: { select: { resources: true, pyqs: true, videos: true } },
    },
  });
}

/**
 * Recommends exams for a user's dashboard. MVP heuristic: match the
 * user's onboarding goals/branch, ranked by upcoming exam date so the
 * most time-sensitive prep surfaces first. Swappable later for a real
 * recommender (e.g. weighting by engagement) without changing callers —
 * see docs/01-architecture.md §1.5.
 */
export async function recommendExamsForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { branch: true, goals: true },
  });
  if (!user || user.goals.length === 0) {
    // No onboarding data yet — fall back to the four flagship tracks.
    return listExams({ isActive: true });
  }
  return prisma.exam.findMany({
    where: {
      isActive: true,
      category: { in: user.goals },
      OR: [{ branch: user.branch }, { branch: null }],
    },
    orderBy: [{ examDate: "asc" }],
    take: 6,
  });
}

export async function getUpcomingExams(limit = 5) {
  return prisma.exam.findMany({
    where: { isActive: true, examDate: { gte: new Date() } },
    orderBy: { examDate: "asc" },
    take: limit,
    select: { id: true, slug: true, shortTitle: true, examDate: true },
  });
}

/* ─────────────────────────────────────────────
   ADMIN SERVICES
───────────────────────────────────────────── */

export async function listAdminExams() {
  return prisma.exam.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortTitle: true,
      category: true,
      branch: true,
      isActive: true,
      examDate: true,
    },
  });
}

export async function getAdminExam(id: string) {
  return prisma.exam.findUnique({
    where: { id },
    include: {
      faqs: {
        orderBy: {
          order: "asc",
        },
      },
      cutoffs: {
        orderBy: {
          year: "desc",
        },
      },
      pyqs: {
        orderBy: {
          year: "desc",
        },
      },
      videos: true,
      resources: true,
    },
  });
}

export async function updateExam(
  id: string,
  data: {
    title?: string;
    shortTitle?: string;
    overview?: string;
    eligibility?: string;
    examPattern?: string;
    syllabus?: string;
    examDate?: Date | null;
    applicationDeadline?: Date | null;
  }
) {
  return prisma.exam.update({
    where: { id },
    data,
  });
}