import { prisma } from "@/lib/prisma";
import { recommendExamsForUser, getUpcomingExams } from "@/services/examService";
import { getRecentlyViewed, getRoadmapProgress } from "@/services/progressService";
import { daysUntil } from "@/lib/utils";
import type { DashboardPayload } from "@/types";

/** Picks one roadmap relevant to the user's goals to surface on the dashboard widget. */
async function getActiveRoadmapForUser(userId: string, goals: string[]) {
  if (goals.length === 0) return null;
  const roadmap = await prisma.roadmap.findFirst({
    where: { exam: { category: { in: goals as never[] }, isActive: true } },
    include: { exam: { select: { slug: true } }, steps: { orderBy: { order: "asc" } } },
  });
  if (!roadmap) return null;

  const percentComplete = await getRoadmapProgress(userId, roadmap.id);

  const completedStepIds = new Set(
    (
      await prisma.userProgress.findMany({
        where: { userId, contentType: "ROADMAP_STEP", status: "COMPLETED", roadmapStep: { roadmapId: roadmap.id } },
        select: { roadmapStepId: true },
      })
    ).map((p) => p.roadmapStepId)
  );
  const nextStep = roadmap.steps.find((s) => !completedStepIds.has(s.id)) ?? null;

  return {
    id: roadmap.id,
    title: roadmap.title,
    percentComplete,
    examSlug: roadmap.exam.slug,
    nextStep: nextStep ? { id: nextStep.id, title: nextStep.title } : null,
  };
}

function recentlyViewedLabel(p: Awaited<ReturnType<typeof getRecentlyViewed>>[number]) {
  if (p.resource) return { title: p.resource.title, href: `/resources?resourceId=${p.resourceId}` };
  if (p.pyq) return { title: `${p.pyq.exam.shortTitle} ${p.pyq.year} PYQ`, href: `/exam/${p.exam?.slug ?? ""}?tab=pyqs` };
  if (p.video) return { title: p.video.title, href: `/exam/${p.exam?.slug ?? ""}?tab=videos` };
  if (p.roadmapStep) return { title: p.roadmapStep.title, href: `/exam/${p.exam?.slug ?? ""}?tab=resources` };
  if (p.exam) return { title: p.exam.title, href: `/exam/${p.exam.slug}` };
  return { title: "Untitled", href: "/resources" };
}

export async function getDashboardPayload(userId: string): Promise<DashboardPayload> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { goals: true } });
  const goals = user?.goals ?? [];

  const [recommended, recentProgress, roadmap, upcoming] = await Promise.all([
    recommendExamsForUser(userId),
    getRecentlyViewed(userId, 10),
    getActiveRoadmapForUser(userId, goals),
    getUpcomingExams(5),
  ]);

  return {
    recommendedExams: recommended.map((e) => ({
      id: e.id,
      slug: e.slug,
      shortTitle: e.shortTitle,
      category: e.category,
    })),
    roadmap,
    recentlyViewed: recentProgress.map((p) => ({
      id: p.id,
      ...recentlyViewedLabel(p),
      viewedAt: p.lastViewedAt.toISOString(),
    })),
    upcomingExams: upcoming
      .filter((e) => e.examDate)
      .map((e) => ({
        id: e.id,
        slug: e.slug,
        shortTitle: e.shortTitle,
        examDate: e.examDate!.toISOString(),
        daysUntil: daysUntil(e.examDate!),
      })),
  };
}
