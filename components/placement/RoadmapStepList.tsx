"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export interface RoadmapStepListProps {
  steps: Array<{ id: string; order: number; title: string; description: string | null; resourceUrl: string | null }>;
  completedStepIds: string[];
}

export function RoadmapStepList({ steps, completedStepIds }: RoadmapStepListProps) {
  const [completed, setCompleted] = useState(new Set(completedStepIds));
  const { firebaseUser, getIdToken } = useAuth();
  const router = useRouter();

  async function toggleStep(stepId: string) {
    if (!firebaseUser) {
      router.push("/login?next=/placements/dsa-roadmap");
      return;
    }
    const isDone = completed.has(stepId);
    const next = new Set(completed);
    isDone ? next.delete(stepId) : next.add(stepId);
    setCompleted(next);

    const token = await getIdToken();
    await fetch("/api/user/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        contentType: "ROADMAP_STEP",
        contentId: stepId,
        status: isDone ? "VIEWED" : "COMPLETED",
      }),
    }).catch(() => setCompleted(completed)); // revert on failure
  }

  const percent = steps.length === 0 ? 0 : Math.round((completed.size / steps.length) * 100);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          <span className="stat-number font-semibold text-primary">{percent}%</span> complete
        </p>
        <p className="stat-number text-xs text-ink-muted">
          {completed.size}/{steps.length} steps
        </p>
      </div>
      <ol className="space-y-2">
        {steps.map((step) => {
          const isDone = completed.has(step.id);
          return (
            <li key={step.id}>
              <button
                onClick={() => toggleStep(step.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                  isDone ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    isDone ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}
                >
                  {isDone && <Check className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-medium", isDone && "text-ink-muted line-through")}>
                    {step.order}. {step.title}
                  </p>
                  {step.description && <p className="mt-0.5 text-sm text-ink-muted">{step.description}</p>}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
