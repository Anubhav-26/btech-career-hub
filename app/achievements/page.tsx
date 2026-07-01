import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { getServerUser } from "@/lib/auth";
import { getUserXPAndAchievements, ACHIEVEMENTS } from "@/services/phase2";
import { Card, CardContent } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Achievements",
};

export const dynamic = "force-dynamic";

const RARITY_STYLE: Record<string, string> = {
  COMMON: "border-border bg-muted/30",
  RARE: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20",
  EPIC: "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/20",
  LEGENDARY:
    "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20",
};

type AchievementItem = {
  slug: string;
  title: string;
  icon: string;
  rarity: string;
};

export default async function AchievementsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?next=/achievements");
  }

  const data = await getUserXPAndAchievements(user.id);

  const earnedSlugs = (data.achievements as AchievementItem[]).map(
    (a) => a.slug
  );

  return (
    <div className="container max-w-3xl py-6 md:py-8">
      <div className="mb-1 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h1 className="font-display text-2xl font-semibold">
          Achievements
        </h1>
      </div>

      <p className="mb-6 text-sm text-ink-muted">
        Earn XP, level up, and unlock badges by studying consistently.
      </p>

      {/* XP Card */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Level
              </p>
              <p className="stat-number text-4xl font-semibold text-primary">
                {data.level}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-ink-muted">Total XP</p>
              <p className="stat-number text-2xl font-semibold">
                {data.totalXP.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${data.progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-ink-muted">
            <span>{data.currentLevelXP} XP</span>

            <span>
              {data.progress}% to Level {data.level + 1}
            </span>

            <span>{data.nextLevelXP} XP</span>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((ach) => {
          const earned = earnedSlugs.includes(ach.slug);

          return (
            <div
              key={ach.slug}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-opacity",
                earned
                  ? RARITY_STYLE[ach.rarity]
                  : "border-border bg-surface opacity-50"
              )}
            >
              <span className="shrink-0 text-2xl">
                {ach.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      !earned && "text-ink-muted"
                    )}
                  >
                    {ach.title}
                  </p>

                  <IndexChip>
                    {ach.rarity}
                  </IndexChip>
                </div>

                <p className="mt-1 text-xs text-ink-muted">
                  {ach.description}
                </p>

                <p className="stat-number mt-2 text-xs text-primary">
                  +{ach.xpReward} XP
                </p>
              </div>

              {earned && (
                <span className="shrink-0 text-primary">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}