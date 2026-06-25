"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Cpu, Radio, Cog, Building, Zap, Laptop, FlaskConical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { Branch, ExamCategory } from "@prisma/client";

const BRANCHES: { value: Branch; label: string; icon: typeof Cpu }[] = [
  { value: "CSE", label: "Computer Science (CSE)", icon: Cpu },
  { value: "ECE", label: "Electronics (ECE)", icon: Radio },
  { value: "ME", label: "Mechanical (ME)", icon: Cog },
  { value: "CE", label: "Civil (CE)", icon: Building },
  { value: "EE", label: "Electrical (EE)", icon: Zap },
  { value: "IT", label: "Information Technology (IT)", icon: Laptop },
  { value: "CHEMICAL", label: "Chemical", icon: FlaskConical },
  { value: "OTHER", label: "Other", icon: MoreHorizontal },
];

const GOALS: { value: ExamCategory; label: string; blurb: string }[] = [
  { value: "GATE", label: "GATE", blurb: "M.Tech admission & PSU recruitment" },
  { value: "PSU", label: "PSU Recruitment", blurb: "Direct hiring + GATE-based PSU jobs" },
  { value: "CAT", label: "CAT", blurb: "MBA admission to IIMs and B-schools" },
  { value: "PLACEMENT", label: "Placements", blurb: "Campus placements & DSA prep" },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [goals, setGoals] = useState<ExamCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { getIdToken } = useAuth();
  const router = useRouter();

  function toggleGoal(g: ExamCategory) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  }

  async function finish() {
    setSubmitting(true);
    try {
      const token = await getIdToken();
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ branch, year, goals }),
      });
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-md py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("h-1.5 w-8 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
        <button onClick={() => router.push("/dashboard")} className="text-xs text-ink-muted hover:text-ink">
          Skip
        </button>
      </div>

      {step === 0 && (
        <div>
          <h1 className="font-display text-xl font-semibold">What&apos;s your branch?</h1>
          <div className="mt-5 space-y-2">
            {BRANCHES.map((b) => (
              <button
                key={b.value}
                onClick={() => setBranch(b.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  branch === b.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <b.icon className="h-4 w-4 shrink-0 text-ink-muted" />
                <span className="flex-1">{b.label}</span>
                {branch === b.value && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={!branch} onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="font-display text-xl font-semibold">Which year are you in?</h1>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={cn(
                  "rounded-lg border px-4 py-6 text-center transition-colors",
                  year === y ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <span className="stat-number text-2xl font-semibold">{y}</span>
                <p className="mt-1 text-xs text-ink-muted">{["1st", "2nd", "3rd", "4th"][y - 1]} Year</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button size="lg" variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button size="lg" className="flex-1" disabled={!year} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="font-display text-xl font-semibold">What are you targeting?</h1>
          <p className="mt-1 text-sm text-ink-muted">Pick as many as apply — most students choose two.</p>
          <div className="mt-5 space-y-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => toggleGoal(g.value)}
                className={cn(
                  "flex w-full items-start justify-between rounded-lg border px-4 py-4 text-left transition-colors",
                  goals.includes(g.value) ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <div>
                  <p className="font-display font-medium">{g.label}</p>
                  <p className="text-xs text-ink-muted">{g.blurb}</p>
                </div>
                {goals.includes(g.value) && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button size="lg" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button size="lg" className="flex-1" disabled={goals.length === 0 || submitting} onClick={finish}>
              {submitting ? "Saving…" : "Finish"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
