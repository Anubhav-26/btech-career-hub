import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: { name: string | null; email: string; branch: string | null } | null;
  studyHours: number;
  avgMockAccuracy: number;
  score: number;
}

const MEDAL = ["🥇", "🥈", "🥉"];

function initials(entry: LeaderboardEntry) {
  const name = entry.user?.name ?? entry.user?.email ?? "?";
  return name[0].toUpperCase();
}

function displayName(entry: LeaderboardEntry) {
  if (entry.user?.name) return entry.user.name;
  return entry.user?.email.split("@")[0] ?? "Student";
}

export function LeaderboardWidget({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-3">
        <Trophy className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Top Students — Last 30 Days</p>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-ink-muted">No activity data yet.</p>
        ) : (
          <ol className="space-y-2">
            {entries.map((e) => (
              <li key={e.userId} className="flex items-center gap-2">
                <span className="w-5 text-center text-sm">{MEDAL[e.rank - 1] ?? `#${e.rank}`}</span>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(e)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{displayName(e)}</p>
                  <p className="text-[10px] text-ink-muted">
                    {e.studyHours}h · {e.avgMockAccuracy > 0 ? `${e.avgMockAccuracy}% accuracy` : "no tests"}
                  </p>
                </div>
                {e.user?.branch && <IndexChip>{e.user.branch}</IndexChip>}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
