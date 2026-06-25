import { prisma } from "@/lib/prisma";

/** Returns ISO date string for a UTC date (YYYY-MM-DD) */
function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

/** Builds a map of date→totalMinutes for the past `days` days */
export async function getStudyHeatmapData(userId: string, days = 365) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.studyLog.findMany({
    where: { userId, date: { gte: since } },
    select: { date: true, minutes: true },
  });

  const map: Record<string, number> = {};
  for (const log of logs) {
    const key = toDateStr(log.date);
    map[key] = (map[key] ?? 0) + log.minutes;
  }
  return map; // { "2025-01-15": 90, ... }
}

/** Computes current streak, longest streak, and total active days */
export function computeStreaks(heatmapData: Record<string, number>) {
  const activeDates = Object.keys(heatmapData)
    .filter((d) => heatmapData[d] > 0)
    .sort();

  if (activeDates.length === 0) return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };

  let longestStreak = 1;
  let runStreak = 1;

  for (let i = 1; i < activeDates.length; i++) {
    const prev = new Date(activeDates[i - 1]);
    const curr = new Date(activeDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      runStreak++;
      longestStreak = Math.max(longestStreak, runStreak);
    } else {
      runStreak = 1;
    }
  }

  // Current streak: count backwards from today
  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86400000));
  let currentStreak = 0;

  if (heatmapData[today] || heatmapData[yesterday]) {
    const start = heatmapData[today] ? today : yesterday;
    let cursor = new Date(start);
    while (heatmapData[toDateStr(cursor)]) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - 86400000);
    }
  }

  return { currentStreak, longestStreak, totalActiveDays: activeDates.length };
}

/** Today's minutes, this week, this month, and subject-wise breakdown */
export async function getStudyStats(userId: string) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayLogs, weekLogs, monthLogs] = await Promise.all([
    prisma.studyLog.findMany({ where: { userId, date: { gte: startOfToday } }, select: { minutes: true, subject: true } }),
    prisma.studyLog.findMany({ where: { userId, date: { gte: startOfWeek } }, select: { minutes: true, subject: true } }),
    prisma.studyLog.findMany({ where: { userId, date: { gte: startOfMonth } }, select: { minutes: true, subject: true } }),
  ]);

  const sum = (arr: { minutes: number }[]) => arr.reduce((a, b) => a + b.minutes, 0);
  const bySubject: Record<string, number> = {};
  for (const l of monthLogs) bySubject[l.subject] = (bySubject[l.subject] ?? 0) + l.minutes;

  return {
    todayMinutes: sum(todayLogs),
    weekMinutes: sum(weekLogs),
    monthMinutes: sum(monthLogs),
    subjectBreakdown: Object.entries(bySubject)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, minutes]) => ({ subject, minutes })),
  };
}

/** Recent study logs for the tracker table */
export async function getRecentStudyLogs(userId: string, limit = 10) {
  return prisma.studyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    select: { id: true, date: true, topic: true, subject: true, minutes: true, notes: true, examCategory: true },
  });
}
