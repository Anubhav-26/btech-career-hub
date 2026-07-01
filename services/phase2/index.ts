import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// 📊 PLACEMENT
// ─────────────────────────────────────────────

export async function getPlacementStats(userId: string) {
  const apps = await prisma.placementApplication.findMany({
    where: { userId },
    select: { status: true },
  });

  const counts: Record<
    "APPLIED" | "OA_CLEARED" | "INTERVIEW_SCHEDULED" | "SELECTED" | "REJECTED",
    number
  > = {
    APPLIED: 0,
    OA_CLEARED: 0,
    INTERVIEW_SCHEDULED: 0,
    SELECTED: 0,
    REJECTED: 0,
  };

  for (const a of apps) {
    const status = a.status as keyof typeof counts;
    if (counts[status] !== undefined) counts[status]++;
  }

  return { ...counts, total: apps.length };
}

// ─────────────────────────────────────────────
// 🏢 INTERNSHIPS
// ─────────────────────────────────────────────

export async function listInternships(filters: {
  workMode?: string;
  branch?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const where: any = {
    isActive: filters.isActive ?? true,
  };

  if (filters.workMode) where.workMode = filters.workMode;
  if (filters.branch) where.branches = { has: filters.branch };

  const [items, total] = await Promise.all([
    prisma.internship.findMany({
      where,
      orderBy: { deadline: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.internship.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

// ─────────────────────────────────────────────
// 🎓 SCHOLARSHIPS
// ─────────────────────────────────────────────

export async function listScholarships(filters?: {
  type?: string;
  branch?: string;
  active?: boolean;
}) {
  const where: any = {
    isActive: filters?.active ?? true,
  };

  if (filters?.type) where.type = filters.type;
  if (filters?.branch) where.branches = { has: filters.branch };

  return prisma.scholarship.findMany({
    where,
    orderBy: { deadline: "asc" },
  });
}

// ─────────────────────────────────────────────
// 🏢 PSU
// ─────────────────────────────────────────────

export async function listPSUs(filters?: {
  branch?: string;
  isActive?: boolean;
  minGateScore?: number;
}) {
  const where: any = {
    isActive: filters?.isActive ?? true,
  };

  if (filters?.branch) where.branches = { has: filters.branch };
  if (filters?.minGateScore !== undefined)
    where.minGateScore = { gte: filters.minGateScore };

  return prisma.pSUCompany.findMany({
    where,
    include: {
      cutoffs: {
        orderBy: [{ year: "desc" }, { branch: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });
}

// ─────────────────────────────────────────────
// 🧠 XP SYSTEM
// ─────────────────────────────────────────────

export function xpToLevel(xp: number) {
  return Math.floor(1 + Math.sqrt(xp / 100));
}

export function levelToXP(level: number) {
  return (level - 1) * (level - 1) * 100;
}

// ─────────────────────────────────────────────
// 🏆 ACHIEVEMENTS (SINGLE SOURCE OF TRUTH)
// ─────────────────────────────────────────────

export const ACHIEVEMENTS = [
  {
    slug: "first-log",
    title: "First Step",
    description: "Log your first study session",
    icon: "📚",
    xpReward: 50,
    category: "STUDY",
    rarity: "COMMON",
  },
  {
    slug: "streak-3",
    title: "On a Roll",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    xpReward: 100,
    category: "STREAK",
    rarity: "COMMON",
  },
  {
    slug: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    xpReward: 250,
    category: "STREAK",
    rarity: "RARE",
  },
  {
    slug: "streak-30",
    title: "Iron Will",
    description: "Maintain a 30-day streak",
    icon: "💎",
    xpReward: 1000,
    category: "STREAK",
    rarity: "LEGENDARY",
  },
] as const;

// ─────────────────────────────────────────────
// 🧾 TYPES
// ─────────────────────────────────────────────

export type AchievementDTO = {
  slug: string;
  title: string;
  icon: string;
  rarity: string;
  description: string;
  xpReward: number;
  category: string;
};

type AchievementRow = {
  achievement: {
    slug: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    category: string;
    rarity?: string;
  };
};

// ─────────────────────────────────────────────
// 🧠 XP + ACHIEVEMENTS SERVICE
// ─────────────────────────────────────────────

export async function getUserXPAndAchievements(userId: string) {
  const [userXP, achievements] = await Promise.all([
    prisma.userXP.findUnique({ where: { userId } }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),
  ]);

  const totalXP = userXP?.totalXP ?? 0;
  const level = xpToLevel(totalXP);

  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);

  const progress =
    nextLevelXP === currentLevelXP
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((totalXP - currentLevelXP) /
                (nextLevelXP - currentLevelXP)) *
                100
            )
          )
        );

  return {
    totalXP,
    level,
    progress,
    nextLevelXP,
    currentLevelXP,

    achievements: (achievements as AchievementRow[]).map(
      (ach): AchievementDTO => ({
        slug: ach.achievement.slug,
        title: ach.achievement.title,
        icon: ach.achievement.icon,
        rarity: ach.achievement.rarity ?? "COMMON",
        description: ach.achievement.description,
        xpReward: ach.achievement.xpReward,
        category: ach.achievement.category,
      })
    ),
  };
}

// ─────────────────────────────────────────────
// 🔔 NOTIFICATIONS
// ─────────────────────────────────────────────

export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" },
  });
}