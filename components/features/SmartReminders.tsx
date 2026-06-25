import { AlertCircle, Flame, Clock, Target } from "lucide-react";

interface ReminderInput {
  currentStreak: number;
  todayMinutes: number;
  countdowns: { title: string; examDate: string }[];
  goals: { title: string; deadline: string | null; isCompleted: boolean }[];
}

export interface Reminder {
  id: string;
  icon: "streak" | "study" | "exam" | "goal";
  message: string;
  urgency: "low" | "medium" | "high";
}

/* ─────────────────────────────────────────────
   CORE LOGIC (SAFE + FIXED)
───────────────────────────────────────────── */
export function computeReminders(input: ReminderInput): Reminder[] {
  const {
    currentStreak,
    todayMinutes,
    countdowns = [],
    goals = [],
  } = input;

  const reminders: Reminder[] = [];

  // 1. No study today
  if (todayMinutes === 0) {
    reminders.push({
      id: "no-study-today",
      icon: "study",
      message:
        "You haven't studied yet today. Even 30 minutes keeps the streak alive.",
      urgency: currentStreak >= 3 ? "high" : "medium",
    });
  }

  // 2. Streak risk
  if (currentStreak >= 3 && todayMinutes === 0) {
    reminders.push({
      id: "streak-risk",
      icon: "streak",
      message: `Your ${currentStreak}-day streak is at risk — log a session today.`,
      urgency: "high",
    });
  }

  // 3. Countdown reminders
  for (const c of countdowns) {
    const days = Math.ceil(
      (new Date(c.examDate).getTime() - Date.now()) / 86400000
    );

    if (!Number.isFinite(days)) continue;

    if (days > 0 && days <= 30) {
      reminders.push({
        id: `countdown-${c.title}-${c.examDate}`,
        icon: "exam",
        message: `${c.title} is only ${days} day${days === 1 ? "" : "s"} away.`,
        urgency: days <= 7 ? "high" : "medium",
      });
    }

    if (days > 30 && days <= 120) {
      reminders.push({
        id: `countdown-far-${c.title}-${c.examDate}`,
        icon: "exam",
        message: `${c.title} is ${days} days away — start planning now.`,
        urgency: "low",
      });
    }
  }

  // 4. Goal reminders
  for (const g of goals) {
    if (!g || g.isCompleted || !g.deadline) continue;

    const days = Math.ceil(
      (new Date(g.deadline).getTime() - Date.now()) / 86400000
    );

    if (!Number.isFinite(days)) continue;

    if (days > 0 && days <= 7) {
      reminders.push({
        id: `goal-${g.title}-${g.deadline}`,
        icon: "goal",
        message: `Goal "${g.title}" due in ${days} day${days === 1 ? "" : "s"}.`,
        urgency: days <= 2 ? "high" : "medium",
      });
    }
  }

  const order = { high: 0, medium: 1, low: 2 };

  return reminders
    .sort((a, b) => order[a.urgency] - order[b.urgency])
    .slice(0, 3);
}

/* ─────────────────────────────────────────────
   UI COMPONENT
───────────────────────────────────────────── */

const ICON_MAP = {
  streak: Flame,
  study: Clock,
  exam: AlertCircle,
  goal: Target,
};

const URGENCY_STYLE = {
  high: "border-red-500/40 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-300",
  medium:
    "border-amber-400/40 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300",
  low: "border-border bg-muted/50 text-foreground",
};

export function SmartReminders({
  reminders,
}: {
  reminders: Reminder[];
}) {
  if (!Array.isArray(reminders) || reminders.length === 0) return null;

  return (
    <div className="space-y-2">
      {reminders.map((r) => {
        const Icon = ICON_MAP[r.icon];
        if (!Icon) return null;

        return (
          <div
            key={r.id}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${URGENCY_STYLE[r.urgency]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{r.message}</p>
          </div>
        );
      })}
    </div>
  );
}