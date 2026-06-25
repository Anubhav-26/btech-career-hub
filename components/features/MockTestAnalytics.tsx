"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface TestEntry {
  id: string;
  date: string;
  label: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  examCategory: string;
}

interface AnalyticsData {
  scores: TestEntry[];
  avgAccuracy: number;
  bestAccuracy: number;
  improvement: number | null;
  totalTests: number;
}

const EXAM_CATEGORIES = ["GATE", "CAT", "PSU", "PLACEMENT", "ESE", "GRE", "ISRO", "DRDO", "BARC"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface p-2 text-xs shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-primary">{payload[0].value}% accuracy</p>
    </div>
  );
};

function AddTestDialog({ onAdded }: { onAdded: (data: AnalyticsData | null) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { getIdToken } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const category = String(form.get("examCategory"));

    const token = await getIdToken();
    await fetch("/api/mock-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        examCategory: category,
        testName: form.get("testName") || undefined,
        score: Number(form.get("score")),
        totalMarks: Number(form.get("totalMarks")),
        takenAt: form.get("takenAt") ? new Date(String(form.get("takenAt"))).toISOString() : undefined,
      }),
    });

    // Refresh analytics
    const res = await fetch(`/api/mock-tests?examCategory=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    onAdded(json.data);
    setSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"><Plus className="h-3 w-3" /> Record test</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Record mock test</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <select name="examCategory" required className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
            <option value="">Select exam category</option>
            {EXAM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input name="testName" placeholder="Test name (optional, e.g. GATE Mock 3)" />
          <div className="grid grid-cols-2 gap-2">
            <Input name="score" type="number" placeholder="Your score" min={0} required />
            <Input name="totalMarks" type="number" placeholder="Total marks" min={1} required />
          </div>
          <Input name="takenAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Record"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MockTestAnalytics({ initialData }: { initialData: AnalyticsData | null }) {
  const [data, setData] = useState<AnalyticsData | null>(initialData);

  if (!data || data.totalTests === 0) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Mock Test Analytics</p>
          <AddTestDialog onAdded={setData} />
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-ink-muted">Record your first mock test to see trends.</p>
        </CardContent>
      </Card>
    );
  }

  const ImprovementIcon = data.improvement === null ? Minus
    : data.improvement > 0 ? TrendingUp : TrendingDown;
  const improvementColor = data.improvement === null ? "text-ink-muted"
    : data.improvement > 0 ? "text-green-600 dark:text-green-400" : "text-destructive";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Mock Test Analytics</p>
        <AddTestDialog onAdded={setData} />
      </CardHeader>
      <CardContent>
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg border border-border p-2 text-center">
            <p className="stat-number text-lg font-semibold text-primary">{data.avgAccuracy}%</p>
            <p className="text-[10px] text-ink-muted">Avg accuracy</p>
          </div>
          <div className="rounded-lg border border-border p-2 text-center">
            <p className="stat-number text-lg font-semibold text-primary">{data.bestAccuracy}%</p>
            <p className="text-[10px] text-ink-muted">Best score</p>
          </div>
          <div className="rounded-lg border border-border p-2 text-center">
            <div className={cn("flex items-center justify-center gap-0.5", improvementColor)}>
              <ImprovementIcon className="h-4 w-4" />
              <p className="stat-number text-lg font-semibold">
                {data.improvement !== null ? `${Math.abs(data.improvement)}%` : "—"}
              </p>
            </div>
            <p className="text-[10px] text-ink-muted">Improvement</p>
          </div>
        </div>

        {/* Recharts trend line */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.scores} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={data.avgAccuracy} stroke="hsl(var(--primary))" strokeDasharray="4 2" strokeOpacity={0.5} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-1 text-center text-[10px] text-ink-muted">{data.totalTests} tests recorded</p>
      </CardContent>
    </Card>
  );
}
