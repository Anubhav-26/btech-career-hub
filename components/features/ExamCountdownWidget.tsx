"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, PinOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { IndexChip } from "@/components/shared/IndexChip";

interface Countdown {
  id: string;
  title: string;
  examDate: string;
  description?: string | null;
}

function daysRemaining(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function progressPercent(examDate: string) {
  // Assume 365 day prep window
  const total = 365 * 86400000;
  const remaining = new Date(examDate).getTime() - Date.now();
  return Math.max(0, Math.min(100, Math.round((1 - remaining / total) * 100)));
}

function CountdownCard({ countdown, pinned, onTogglePin }: { countdown: Countdown; pinned: boolean; onTogglePin?: (id: string) => void }) {
  const days = daysRemaining(countdown.examDate);
  const progress = progressPercent(countdown.examDate);

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium leading-tight">{countdown.title}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{new Date(countdown.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <IndexChip className="shrink-0">
            <span className="stat-number">{days}</span>d
          </IndexChip>
          {onTogglePin && (
            <button onClick={() => onTogglePin(countdown.id)} className="text-ink-muted hover:text-primary">
              {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function ExamCountdownWidget({ countdowns: initialCountdowns, pinnedIds: initialPinnedIds }: {
  countdowns: Countdown[];
  pinnedIds: string[];
}) {
  const [pinned, setPinned] = useState(new Set(initialPinnedIds));
  const { firebaseUser, getIdToken } = useAuth();

  async function togglePin(id: string) {
    if (!firebaseUser) return;
    const token = await getIdToken();
    await fetch(`/api/countdowns/${id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setPinned((prev) => {
      const next = new Set(prev);
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const sorted = [...initialCountdowns].sort((a, b) => daysRemaining(a.examDate) - daysRemaining(b.examDate));

  return (
    <Card>
      <CardContent className="space-y-2 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Upcoming Deadlines</p>
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-ink-muted">No upcoming exams.</p>
        ) : (
          sorted.map((c) => (
            <CountdownCard key={c.id} countdown={c} pinned={pinned.has(c.id)} onTogglePin={firebaseUser ? togglePin : undefined} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
