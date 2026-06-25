"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = ["GATE", "PSU", "CAT", "PLACEMENT", "CUET_PG", "ESE", "GRE", "TOEFL", "IELTS", "ISRO", "DRDO", "BARC"];
const BRANCHES = ["", "CSE", "ECE", "ME", "CE", "EE", "IT", "CHEMICAL", "OTHER"];

/**
 * Metadata is a raw JSON textarea rather than a per-category dynamic form.
 * The server still validates it against metadataSchemaForCategory(category)
 * (lib/validations/exam.ts) — this just trades a richer admin UI for
 * shipping the MVP faster; swap for a generated form per category later
 * without touching the API contract.
 */
export function ExamForm() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getIdToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    let metadata: Record<string, unknown> = {};
    try {
      const raw = String(form.get("metadata") ?? "").trim();
      metadata = raw ? JSON.parse(raw) : {};
    } catch {
      setError("Metadata must be valid JSON");
      setSubmitting(false);
      return;
    }

    const body = {
      slug: form.get("slug"),
      title: form.get("title"),
      shortTitle: form.get("shortTitle"),
      category: form.get("category"),
      branch: form.get("branch") || null,
      overview: form.get("overview"),
      eligibility: form.get("eligibility"),
      examPattern: form.get("examPattern"),
      syllabus: form.get("syllabus"),
      metadata,
    };

    try {
      const token = await getIdToken();
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Failed to create exam");
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ New Exam</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogTitle>New exam</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input name="slug" placeholder="slug (e.g. gate-ece)" required />
            <Select name="category" required defaultValue="">
              <option value="" disabled>
                Category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <Input name="title" placeholder="Title (GATE — Electronics & Comm.)" required />
          <div className="grid grid-cols-2 gap-3">
            <Input name="shortTitle" placeholder="Short title (GATE ECE)" required />
            <Select name="branch" defaultValue="">
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b || "No branch (track-wide)"}
                </option>
              ))}
            </Select>
          </div>
          <textarea name="overview" placeholder="Overview" required rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          <textarea name="eligibility" placeholder="Eligibility" required rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          <textarea name="examPattern" placeholder="Exam pattern" required rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          <textarea name="syllabus" placeholder="Syllabus" required rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          <textarea
            name="metadata"
            placeholder='Metadata JSON, e.g. {"negativeMarking": true, "papers": ["CS"], "totalMarks": 100, "numQuestions": 65}'
            rows={2}
            className="w-full rounded-md border border-border bg-surface p-2 font-mono text-xs"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating…" : "Create exam"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
