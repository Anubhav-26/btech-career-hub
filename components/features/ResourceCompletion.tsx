"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// ── Inline toggle on resource cards ─────────────────────────────────────────

export function ResourceCompleteToggle({
  resourceId,
  initialCompleted = false,
}: {
  resourceId: string;
  initialCompleted?: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [pending, setPending] = useState(false);
  const { firebaseUser, getIdToken } = useAuth();

  async function toggle() {
    if (!firebaseUser) return;
    setPending(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/resource-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resourceId }),
      });
      const json = await res.json();
      setCompleted(json.data?.completed ?? !completed);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={completed ? "Mark as incomplete" : "Mark as completed"}
      className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", completed ? "text-primary" : "text-ink-muted hover:text-primary")}
    >
      {completed
        ? <CheckCircle2 className="h-4 w-4" />
        : <Circle className="h-4 w-4" />
      }
      {completed ? "Done" : "Mark done"}
    </button>
  );
}

// ── Dashboard completion stats widget ───────────────────────────────────────

interface CompletionStats {
  completed: number;
  total: number;
  remaining: number;
  percent: number;
}

export function ResourceCompletionWidget({ stats }: { stats: CompletionStats }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Resource Progress</p>
        <span className="stat-number text-sm font-semibold text-primary">{stats.percent}%</span>
      </CardHeader>
      <CardContent>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.percent}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-ink-muted">
          <span><span className="stat-number font-semibold text-ink">{stats.completed}</span> completed</span>
          <span><span className="stat-number font-semibold text-ink">{stats.remaining}</span> remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
