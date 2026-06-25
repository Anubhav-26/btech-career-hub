"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface StudyStatsProps {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  subjectBreakdown: { subject: string; minutes: number }[];
}

function fmt(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function StudyStats({ todayMinutes, weekMinutes, monthMinutes, subjectBreakdown }: StudyStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Study Time</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today", val: fmt(todayMinutes) },
            { label: "This week", val: fmt(weekMinutes) },
            { label: "This month", val: fmt(monthMinutes) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border p-3 text-center">
              <p className="stat-number text-lg font-semibold text-primary">{s.val}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {subjectBreakdown.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-ink-muted">This month by subject</p>
            {subjectBreakdown.slice(0, 4).map((s) => {
              const max = subjectBreakdown[0].minutes;
              return (
                <div key={s.subject} className="flex items-center gap-2">
                  <span className="w-24 truncate text-xs">{s.subject}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(s.minutes / max) * 100}%` }} />
                  </div>
                  <span className="stat-number text-xs text-ink-muted w-10 text-right">{fmt(s.minutes)}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Floating "+Log study" form  */
export function LogStudyButton({ onLogged }: { onLogged?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          date: form.get("date"),
          topic: form.get("topic"),
          subject: form.get("subject"),
          minutes: Number(form.get("minutes")),
          notes: form.get("notes") || undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error?.message ?? "Failed to log");
        return;
      }
      setOpen(false);
      onLogged?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Log study
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Log a study session</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input name="date" type="date" defaultValue={today} required />
          <Input name="topic" placeholder="Topic (e.g. Binary Trees)" required />
          <Input name="subject" placeholder="Subject (e.g. Data Structures)" required />
          <Input name="minutes" type="number" placeholder="Minutes studied" min={1} max={1440} required />
          <textarea name="notes" placeholder="Notes (optional)" rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging…" : "Log session"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
