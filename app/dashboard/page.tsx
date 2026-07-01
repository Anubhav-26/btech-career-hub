import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { getDashboardPayload } from "@/services/dashboardService";
import { formatBranch } from "@/lib/utils";
import AskAIMentor from "@/components/AskAIMentor";

// Existing widgets
import { RoadmapWidget } from "@/components/dashboard/RoadmapWidget";
import { RecommendedExams } from "@/components/dashboard/RecommendedExams";
import { RecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { UpcomingExams } from "@/components/dashboard/UpcomingExams";

// Phase 1 services
import {
  getStudyHeatmapData,
  computeStreaks,
  getStudyStats,
} from "@/services/phase1/studyService";

import { getUserGoals } from "@/services/phase1/goalService";
import { getMockTestAnalytics } from "@/services/phase1/mockTestService";

import {
  getActiveCountdowns,
  getUserPinnedCountdowns,
  getResourceCompletionStats,
  getVideoProgressStats,
  getContinueWatching,
  getCachedAIRoadmap,
  getLeaderboard,
} from "@/services/phase1/featureServices";

// Phase 1 components
import { StudyHeatmap } from "@/components/features/StudyHeatmap";
import { StudyStats, LogStudyButton } from "@/components/features/StudyTracker";
import { ExamCountdownWidget } from "@/components/features/ExamCountdownWidget";
import { GoalTracker } from "@/components/features/GoalTracker";
import { MockTestAnalytics } from "@/components/features/MockTestAnalytics";
import { ResourceCompletionWidget } from "@/components/features/ResourceCompletion";
import { VideoProgressWidget } from "@/components/features/VideoProgress";
import { LeaderboardWidget } from "@/components/features/Leaderboard";
import { SmartReminders, computeReminders } from "@/components/features/SmartReminders";
import { AIRoadmapGenerator } from "@/components/features/AIRoadmapGenerator";

// ✅ Phase 2
import {
  getUserXPAndAchievements,
  getUnreadNotifications,
  getPlacementStats,
} from "@/services/phase2";

import { XPLevelWidget, NotificationBell } from "@/components/phase2/XPWidget";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/dashboard");
  if (!user.onboardedAt) redirect("/onboarding");

  const [
    dashboardData,
    heatmapData,
    studyStats,
    goals,
    mockAnalytics,
    allCountdowns,
    pinnedCountdowns,
    resourceStats,
    videoStats,
    continueWatching,
    leaderboard,
    cachedRoadmap,

    // Phase 2
    xpData,
    unreadNotifs,
    placementStats,
  ] = await Promise.all([
    getDashboardPayload(user.id),
    getStudyHeatmapData(user.id, 365),
    getStudyStats(user.id),
    getUserGoals(user.id),
    getMockTestAnalytics(user.id),
    getActiveCountdowns(),
    getUserPinnedCountdowns(user.id),
    getResourceCompletionStats(user.id),
    getVideoProgressStats(user.id),
    getContinueWatching(user.id, 3),
    getLeaderboard(10),
    getCachedAIRoadmap(user.id, user.branch ?? "CSE", user.goals?.[0] ?? "GATE"),

    // Phase 2
    getUserXPAndAchievements(user.id),
    getUnreadNotifications(user.id),
    getPlacementStats(user.id),
  ]);

  const streaks = computeStreaks(heatmapData);
  const firstName =
    (user?.name || "").trim().split(" ")[0] || "User";

  const pinnedIds = pinnedCountdowns?.map((c) => c.id) ?? [];

  const reminders = computeReminders({
    currentStreak: streaks.currentStreak,
    todayMinutes: studyStats.todayMinutes,
    countdowns: allCountdowns.map((c) => ({
      title: c.title,
      examDate: c.examDate.toISOString(),
    })),
    goals: (goals ?? []).map((g) => ({
      title: g.title,
      deadline: g.deadline?.toISOString() ?? null,
      isCompleted: g.isCompleted,
    })),
  });

  const roadmapContent = cachedRoadmap
    ? (cachedRoadmap.content as {
        exam: string;
        branch: string;
        months: { month: string; topics: string[] }[];
      })
    : null;

  return (
    <div className="container py-6 md:py-8">

      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">
            Hi {firstName} 👋
          </h1>

          {user.branch && (
            <p className="text-sm text-ink-muted">
              {formatBranch(user.branch)}
              {user.year ? ` · Year ${user.year}` : ""}
              {user.goals?.length ? ` · ${user.goals.join(", ")}` : ""}
            </p>
          )}
        </div>

        <LogStudyButton />
      </div>

      {/* ✅ Phase 2 Top Bar */}
      <div className="mb-4 flex flex-wrap gap-3">
        {unreadNotifs.length > 0 && (
          <NotificationBell unreadCount={unreadNotifs.length} />
        )}
      </div>

      {/* SMART REMINDERS */}
      {reminders?.length > 0 && (
        <div className="mb-6">
          <SmartReminders reminders={reminders} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">

        {/* MAIN */}
        <div className="space-y-6 md:col-span-2">

          <StudyHeatmap heatmap={heatmapData} {...streaks} />

          <StudyStats
            todayMinutes={studyStats.todayMinutes}
            weekMinutes={studyStats.weekMinutes}
            monthMinutes={studyStats.monthMinutes}
            subjectBreakdown={studyStats.subjectBreakdown}
          />

          {/* ✅ XP Widget (IMPORTANT - MOTIVATION BLOCK) */}
          <XPLevelWidget
            xp={{
              totalXP: xpData.totalXP,
              level: xpData.level,
              progress: xpData.progress,
              nextLevelXP: xpData.nextLevelXP,
              currentLevelXP: xpData.currentLevelXP,
              achievements: xpData.achievements,
            }}
          />

          <GoalTracker
            initialGoals={(goals ?? []).map((g) => ({
              ...g,
              deadline: g.deadline?.toISOString() ?? null,
              examCategory: g.examCategory ?? null,
            }))}
          />

          <MockTestAnalytics initialData={mockAnalytics} />

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase text-ink-muted">
              Recommended for you
            </h2>
            <RecommendedExams exams={dashboardData.recommendedExams} />
          </section>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase text-ink-muted">
              Your Roadmap
            </h2>
            <RoadmapWidget roadmap={dashboardData.roadmap} />
          </section>

          <div className="md:hidden">
            <AIRoadmapGenerator
              initialRoadmap={roadmapContent}
              userBranch={user.branch ?? undefined}
              userYear={user.year ?? undefined}
            />
          </div>

          <AskAIMentor />
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">

          <ExamCountdownWidget
            countdowns={allCountdowns.map((c) => ({
              ...c,
              examDate: c.examDate.toISOString(),
            }))}
            pinnedIds={pinnedIds}
          />

          <ResourceCompletionWidget stats={resourceStats} />

          <VideoProgressWidget
            stats={{
              ...videoStats,
              continueWatching: continueWatching.map((v) => ({
                ...v,
                updatedAt: v.updatedAt.toISOString(),
                video: { ...v.video, exam: v.video.exam },
              })),
            }}
          />

          <LeaderboardWidget
            entries={leaderboard.map((e) => ({
              ...e,
              user: e.user
                ? {
                    name: e.user.name,
                    email: e.user.email,
                    branch: e.user.branch ?? null,
                  }
                : null,
            }))}
          />

          {/* (Optional later: Placement Widget UI) */}

          <div className="hidden md:block">
            <AIRoadmapGenerator
              initialRoadmap={roadmapContent}
              userBranch={user.branch ?? undefined}
              userYear={user.year ?? undefined}
            />
          </div>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase text-ink-muted">
              Recently viewed
            </h2>
            <RecentlyViewed items={dashboardData.recentlyViewed} />
          </section>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase text-ink-muted">
              Upcoming exams
            </h2>
            <UpcomingExams exams={dashboardData.upcomingExams} />
          </section>

        </div>
      </div>
    </div>
  );
}