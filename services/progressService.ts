import { prisma } from "@/lib/prisma";
import type { ProgressContentType, ProgressStatus } from "@prisma/client";

const FK_FIELD_BY_TYPE: Record<ProgressContentType, string> = {
  RESOURCE: "resourceId",
  PYQ: "pyqId",
  VIDEO: "videoId",
  ROADMAP_STEP: "roadmapStepId",
  EXAM: "examId",
};

/**
 * Upserts a UserProgress row. Exactly one FK is set, matching contentType —
 * enforced here at the application layer since Postgres doesn't have a
 * clean native XOR constraint for "exactly one of these columns is set"
 * (see docs/02-database-schema.md §2.5).
 */
export async function recordProgress(
  userId: string,
  contentType: ProgressContentType,
  contentId: string,
  status: ProgressStatus
) {
  const fkField = FK_FIELD_BY_TYPE[contentType];

  const existing = await prisma.userProgress.findFirst({
    where: { userId, contentType, [fkField]: contentId },
  });

  if (existing) {
    return prisma.userProgress.update({
      where: { id: existing.id },
      data: { status, lastViewedAt: new Date() },
    });
  }

  return prisma.userProgress.create({
    data: { userId, contentType, status, [fkField]: contentId },
  });
}

export async function getRecentlyViewed(userId: string, limit = 10) {
  return prisma.userProgress.findMany({
    where: { userId },
    orderBy: { lastViewedAt: "desc" },
    take: limit,
    include: {
      resource: { select: { title: true, type: true } },
      pyq: { select: { year: true, exam: { select: { shortTitle: true } } } },
      video: { select: { title: true } },
      roadmapStep: { select: { title: true } },
      exam: { select: { title: true, slug: true } },
    },
  });
}

/** Roadmap completion % for the dashboard widget — see docs/04 §4.1. */
export async function getRoadmapProgress(userId: string, roadmapId: string) {
  const [totalSteps, completedSteps] = await Promise.all([
    prisma.roadmapStep.count({ where: { roadmapId } }),
    prisma.userProgress.count({
      where: {
        userId,
        contentType: "ROADMAP_STEP",
        status: "COMPLETED",
        roadmapStep: { roadmapId },
      },
    }),
  ]);
  return totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
}

/** IDs of completed steps within one roadmap, used to hydrate the
 * RoadmapStepList checklist on first server render. */
export async function getCompletedStepIds(userId: string, roadmapId: string) {
  const rows = await prisma.userProgress.findMany({
    where: { userId, contentType: "ROADMAP_STEP", status: "COMPLETED", roadmapStep: { roadmapId } },
    select: { roadmapStepId: true },
  });
  return rows.map((r) => r.roadmapStepId).filter((id): id is string => Boolean(id));
}
