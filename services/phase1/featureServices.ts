import { prisma } from "@/lib/prisma";

// ── Feature 3: Exam Countdown ────────────────────────────────────────────────

export async function getActiveCountdowns() {
  return prisma.examCountdown.findMany({
    where: { isActive: true, examDate: { gte: new Date() } },
    orderBy: { examDate: "asc" },
  });
}

export async function getUserPinnedCountdowns(userId: string) {
  const pinned = await prisma.pinnedCountdown.findMany({
    where: { userId },
    include: { countdown: true },
  });
  return pinned
    .filter((p) => p.countdown.examDate > new Date())
    .sort((a, b) => a.countdown.examDate.getTime() - b.countdown.examDate.getTime())
    .map((p) => p.countdown);
}

export async function togglePinnedCountdown(userId: string, countdownId: string) {
  const existing = await prisma.pinnedCountdown.findUnique({
    where: { userId_countdownId: { userId, countdownId } },
  });
  if (existing) {
    await prisma.pinnedCountdown.delete({ where: { userId_countdownId: { userId, countdownId } } });
    return { pinned: false };
  }
  await prisma.pinnedCountdown.create({ data: { userId, countdownId } });
  return { pinned: true };
}

// ── Feature 6: Resource Completion ──────────────────────────────────────────

export async function getResourceCompletionStats(userId: string, examSlug?: string) {
  const where = examSlug
    ? { resource: { exam: { slug: examSlug } } }
    : {};

  const [completed, total] = await Promise.all([
    prisma.resourceCompletion.count({ where: { userId, ...where } }),
    prisma.resource.count({ where: examSlug ? { exam: { slug: examSlug } } : {} }),
  ]);

  return { completed, total, remaining: total - completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export async function toggleResourceCompletion(userId: string, resourceId: string) {
  const existing = await prisma.resourceCompletion.findUnique({
    where: { userId_resourceId: { userId, resourceId } },
  });
  if (existing) {
    await prisma.resourceCompletion.delete({ where: { userId_resourceId: { userId, resourceId } } });
    return { completed: false };
  }
  await prisma.resourceCompletion.create({ data: { userId, resourceId } });
  return { completed: true };
}

export async function getCompletedResourceIds(userId: string): Promise<string[]> {
  const rows = await prisma.resourceCompletion.findMany({ where: { userId }, select: { resourceId: true } });
  return rows.map((r) => r.resourceId);
}

// ── Feature 7: Video Progress ────────────────────────────────────────────────

export async function upsertVideoProgress(userId: string, videoId: string, watchedSecs: number, isCompleted: boolean) {
  return prisma.videoProgress.upsert({
    where: { userId_videoId: { userId, videoId } },
    update: { watchedSecs, isCompleted, completedAt: isCompleted ? new Date() : undefined },
    create: { userId, videoId, watchedSecs, isCompleted, completedAt: isCompleted ? new Date() : undefined },
  });
}

export async function getVideoProgressStats(userId: string) {
  const [completed, inProgress] = await Promise.all([
    prisma.videoProgress.count({ where: { userId, isCompleted: true } }),
    prisma.videoProgress.count({ where: { userId, isCompleted: false, watchedSecs: { gt: 0 } } }),
  ]);
  return { completed, inProgress };
}

export async function getContinueWatching(userId: string, limit = 5) {
  return prisma.videoProgress.findMany({
    where: { userId, isCompleted: false, watchedSecs: { gt: 0 } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: { video: { select: { id: true, title: true, youtubeId: true, exam: { select: { slug: true, shortTitle: true } } } } },
  });
}

// ── Feature 8: Leaderboard ───────────────────────────────────────────────────

export async function getLeaderboard(limit = 10) {
  // Computed from StudyLog (hours) + streak data + MockTest (avg accuracy)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

  // Total study minutes per user (last 30 days)
  const studyTotals = await prisma.studyLog.groupBy({
    by: ["userId"],
    where: { date: { gte: thirtyDaysAgo } },
    _sum: { minutes: true },
  });

  // Avg mock test accuracy per user
  const mockTests = await prisma.mockTest.findMany({
    where: { takenAt: { gte: thirtyDaysAgo } },
    select: { userId: true, score: true, totalMarks: true },
  });

  const mockByUser: Record<string, { sum: number; count: number }> = {};
  for (const m of mockTests) {
    mockByUser[m.userId] = mockByUser[m.userId] ?? { sum: 0, count: 0 };
    mockByUser[m.userId].sum += (m.score / m.totalMarks) * 100;
    mockByUser[m.userId].count++;
  }

  const userIds = [...new Set([...studyTotals.map((s) => s.userId)])];
  if (userIds.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, avatarUrl: true, branch: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const entries = studyTotals.map((s) => {
    const mockData = mockByUser[s.userId];
    const avgMockAccuracy = mockData ? Math.round(mockData.sum / mockData.count) : 0;
    const studyHours = Math.round((s._sum.minutes ?? 0) / 60);
    // Simple composite score: study hours * 2 + mock accuracy
    const score = studyHours * 2 + avgMockAccuracy;
    return { userId: s.userId, user: userMap[s.userId], studyHours, avgMockAccuracy, score };
  });

  return entries
    .filter((e) => e.user)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

// ── Feature 10: AI Roadmap (cached) ─────────────────────────────────────────

export async function getCachedAIRoadmap(userId: string, branch: string, targetExam: string) {
  return prisma.aIRoadmap.findUnique({
    where: { userId_branch_targetExam: { userId, branch: branch as never, targetExam: targetExam as never } },
  });
}

export async function saveAIRoadmap(userId: string, branch: string, targetExam: string, currentYear: number, content: object) {
  return prisma.aIRoadmap.upsert({
    where: { userId_branch_targetExam: { userId, branch: branch as never, targetExam: targetExam as never } },
    update: { content, currentYear },
    create: { userId, branch: branch as never, targetExam: targetExam as never, currentYear, content },
  });
}
