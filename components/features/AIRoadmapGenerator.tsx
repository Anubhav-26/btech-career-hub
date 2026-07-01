"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface MonthPlan { month: string; topics: string[] }
interface RoadmapContent { exam: string; branch: string; months: MonthPlan[] }

const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "CHEMICAL", "OTHER"];
const EXAMS = ["GATE", "CAT", "PSU", "PLACEMENT", "ESE", "GRE", "TOEFL", "IELTS", "ISRO", "DRDO", "BARC"];

function MonthCard({ plan, index }: { plan: MonthPlan; index: number }) {
  const [open, setOpen] = useState(index < 2);
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted"
      >
        <div className="flex items-center gap-2">
          <span className="stat-number text-xs text-primary font-semibold">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-medium">{plan.month}</span>
          <span className="text-xs text-ink-muted">{plan.topics.length} topics</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-ink-muted" /> : <ChevronDown className="h-4 w-4 text-ink-muted" />}
      </button>
      {open && (
        <ul className="border-t border-border bg-muted/30 px-3 py-2 space-y-1">
          {plan.topics.map((t, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AIRoadmapGenerator({ initialRoadmap, userBranch, userYear }: {
  initialRoadmap: RoadmapContent | null;
  userBranch?: string;
  userYear?: number;
}) {
  const [roadmap, setRoadmap] = useState<RoadmapContent | null>(initialRoadmap);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!initialRoadmap);
  const { getIdToken } = useAuth();

  async function generate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/ai-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          branch: form.get("branch"),
          targetExam: form.get("targetExam"),
          currentYear: Number(form.get("currentYear")),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Failed to generate roadmap");
        return;
      }
      setRoadmap(json.data);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">AI Roadmap</p>
        </div>
        {roadmap && (
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "View roadmap" : "Regenerate"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={generate} className="space-y-3">
            <select name="branch" defaultValue={userBranch ?? ""} required className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
              <option value="" disabled>Your branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select name="targetExam" required className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
              <option value="" disabled>Target exam</option>
              {EXAMS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <select name="currentYear" defaultValue={String(userYear ?? 2)} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-pulse" /> Generating…</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Generate roadmap</span>
              )}
            </Button>
            <p className="text-center text-xs text-ink-muted">Powered by: B.Tech-Career Hub</p>
          </form>
        ) : roadmap ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-semibold">{roadmap.exam} Prep Plan</p>
                <p className="text-xs text-ink-muted">{roadmap.branch} branch · {roadmap.months.length} months</p>
              </div>
            </div>
            {roadmap.months.map((plan, i) => (
              <MonthCard key={i} plan={plan} index={i} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
