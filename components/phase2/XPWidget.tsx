import Link from "next/link";
import { Trophy, Bell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface XPData {
  totalXP: number;
  level: number;
  progress: number;
  nextLevelXP: number;
  currentLevelXP: number;
  achievements: { slug: string; title: string; icon: string; rarity: string }[];
  earnedSlugs?: string[];
}

interface NotifData {
  unreadCount: number;
}

export function XPLevelWidget({ xp }: { xp: XPData }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Level {xp.level}</p>
        </div>
        <Link href="/achievements" className="text-xs text-primary hover:underline">All badges →</Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-1.5">
          <span className="stat-number text-2xl font-semibold text-primary">{xp.totalXP.toLocaleString()} XP</span>
          <span className="text-xs text-ink-muted">{xp.progress}% → Lv {xp.level + 1}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${xp.progress}%` }} />
        </div>

        {xp.achievements.length > 0 && (
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {xp.achievements.slice(0, 6).map((a) => (
              <span key={a.slug} title={a.title} className="text-xl cursor-default">{a.icon}</span>
            ))}
            {xp.achievements.length > 6 && (
              <span className="text-xs text-ink-muted self-center">+{xp.achievements.length - 6} more</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  if (unreadCount === 0) return null;
  return (
    <Link href="/notifications" className="relative flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10">
      <Bell className="h-4 w-4" />
      <span>{unreadCount} new notification{unreadCount > 1 ? "s" : ""}</span>
    </Link>
  );
}
