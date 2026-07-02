"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, Target } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string | null;
  isCompleted: boolean;
  examCategory: string | null;
}

function percent(g: Goal) {
  return Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
}

function GoalBar({ goal, onEdit, onDelete, onIncrement }: {
  goal: Goal;
  onEdit: (g: Goal) => void;
  onDelete: (id: string) => void;
  onIncrement: (id: string, val: number) => void;
}) {
  const pct = percent(goal);
  return (
    <div className={cn("rounded-lg border border-border p-3", goal.isCompleted && "bg-primary/5 border-primary/30")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {goal.isCompleted && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
            <p className={cn("text-sm font-medium truncate", goal.isCompleted && "text-ink-muted line-through")}>{goal.title}</p>
          </div>
          {goal.description && <p className="mt-0.5 text-xs text-ink-muted truncate">{goal.description}</p>}
          {goal.deadline && !goal.isCompleted && (
            <p className="mt-0.5 text-xs text-ink-muted">
              Due {new Date(goal.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="stat-number text-xs text-primary font-semibold">{pct}%</span>
          <button onClick={() => onEdit(goal)} className="p-1 text-ink-muted hover:text-ink">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-1 text-ink-muted hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", goal.isCompleted ? "bg-primary" : "bg-primary/70")}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="stat-number text-xs text-ink-muted">
          {goal.currentValue}/{goal.targetValue} {goal.unit !== "percent" ? goal.unit : ""}
        </span>
        {!goal.isCompleted && (
          <div className="flex items-center gap-1">
            {[1, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => onIncrement(goal.id, Math.min(goal.targetValue, goal.currentValue + n))}
                className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-ink-muted hover:bg-muted"
              >
                +{n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GoalFormDialog({ existing, onSave, children }: {
  existing?: Goal;
  onSave: (data: Partial<Goal>) => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    await onSave({
      title: String(form.get("title")),
      description: String(form.get("description") || ""),
      targetValue: Number(form.get("targetValue")),
      currentValue: Number(form.get("currentValue")),
      unit: String(form.get("unit")),
      deadline: form.get("deadline") ? new Date(String(form.get("deadline"))).toISOString() : undefined,
    });
    setSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{existing ? "Edit goal" : "New goal"}</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input name="title" placeholder="Goal title (e.g. Complete DSA)" defaultValue={existing?.title} required />
          <Input name="description" placeholder="Description (optional)" defaultValue={existing?.description ?? ""} />
          <div className="grid grid-cols-3 gap-2">
            <Input name="currentValue" type="number" placeholder="Current" defaultValue={existing?.currentValue ?? 0} min={0} />
            <Input name="targetValue" type="number" placeholder="Target" defaultValue={existing?.targetValue ?? 100} min={1} />
            <select name="unit" defaultValue={existing?.unit ?? "percent"} className="rounded-md border border-border bg-surface px-2 text-sm">
              {["percent", "questions", "chapters", "hours", "topics"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <Input name="deadline" type="date" defaultValue={existing?.deadline?.slice(0, 10) ?? ""} />
          <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : existing ? "Save changes" : "Create goal"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalTracker({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { getIdToken } = useAuth();
  

  async function authFetch(path: string, opts: RequestInit) {
    const token = await getIdToken();
    return fetch(path, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) } });
  }

  async function createGoal(data: Partial<Goal>) {
  const res = await authFetch("/api/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    setGoals((prev) => [json.data, ...prev]);
  } else {
    alert(json.error?.message ?? "Failed to create goal");
  }
}

  async function editGoal(id: string, data: Partial<Goal>) {
  const res = await authFetch(`/api/goals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (res.ok) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? json.data : g))
    );
  } else {
    alert(json.error?.message ?? "Failed to update goal");
  }
}

  async function deleteGoal(id: string) {
  const res = await authFetch(`/api/goals/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  } else {
    alert("Failed to delete goal.");
  }
}

  async function incrementGoal(id: string, currentValue: number) {
    const res = await authFetch(`/api/goals/${id}`, { method: "PATCH", body: JSON.stringify({ currentValue }) });
    const json = await res.json();
    if (res.ok) setGoals((prev) => prev.map((g) => (g.id === id ? json.data : g)));
  }

  const active = goals.filter((g) => !g.isCompleted);
  const completed = goals.filter((g) => g.isCompleted);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Goals</p>
        <GoalFormDialog onSave={createGoal}>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" /> New
          </Button>
        </GoalFormDialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {goals.length === 0 && (
          <EmptyState icon={Target} title="No goals yet" description="Create your first study goal to track progress." />
        )}
        {active.map((g) => (
          <GoalBar
                  key={g.id}
                  goal={g}
                 onEdit={setEditingGoal}
                 onDelete={deleteGoal}
                onIncrement={incrementGoal}
              />
        ))}
        {completed.length > 0 && (
          <>
            <p className="pt-1 text-xs font-medium text-ink-muted">Completed ({completed.length})</p>
            {completed.map((g) => (
             <GoalBar
                   key={g.id}
                       goal={g}
                       onEdit={setEditingGoal}
                       onDelete={deleteGoal}
                       onIncrement={incrementGoal}
                      />
            ))}
          </>
        )}
      </CardContent>
      {editingGoal && (
  <GoalFormDialog
    existing={editingGoal}
    onSave={async (data) => {
      await editGoal(editingGoal.id, data);
      setEditingGoal(null);
    }}
  >
    <span />
  </GoalFormDialog>
)}
    </Card>
  );
}
