"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "FRESHER", label: "Fresher", desc: "Clean one-page layout for final-year students with projects and internships.", emoji: "📄" },
  { id: "INTERNSHIP", label: "Internship", desc: "Highlights relevant coursework, skills, and mini-projects for internship applications.", emoji: "💼" },
  { id: "RESEARCH", label: "Research", desc: "Publications, research experience, and academic achievements front and centre.", emoji: "🔬" },
] as const;

type TemplateId = typeof TEMPLATES[number]["id"];

interface ResumeFormData {
  name: string; email: string; phone: string; linkedin: string; github: string;
  objective: string; education: string; skills: string;
  experience: string; projects: string; achievements: string;
}

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState<TemplateId>("FRESHER");
  const [step, setStep] = useState<"pick" | "fill" | "done">("pick");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const sections = [
      { sectionType: "OBJECTIVE", content: String(form.get("objective") ?? "") },
      { sectionType: "EDUCATION", content: String(form.get("education") ?? "") },
      { sectionType: "SKILLS", content: String(form.get("skills") ?? "") },
      { sectionType: "EXPERIENCE", content: String(form.get("experience") ?? "") },
      { sectionType: "PROJECTS", content: String(form.get("projects") ?? "") },
      { sectionType: "ACHIEVEMENTS", content: String(form.get("achievements") ?? "") },
    ].filter((s) => s.content.trim());

    const token = await getIdToken();
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: `My ${template} Resume`,
        template,
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        linkedin: form.get("linkedin"),
        github: form.get("github"),
        sections,
      }),
    });
    const json = await res.json();
    setSavedId(json.data?.id ?? null);
    setSaving(false);
    setStep("done");
  }

  if (step === "pick") {
    return (
      <div className="container max-w-2xl py-6 md:py-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-semibold">Resume Builder</h1>
        </div>
        <p className="text-sm text-ink-muted mb-6">ATS-friendly templates for B.Tech students. Pick one to get started.</p>

        <div className="space-y-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplate(t.id); setStep("fill"); }}
              className={cn(
                "w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted",
                template === t.id ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div>
                <p className="font-display font-semibold">{t.label}</p>
                <p className="text-sm text-ink-muted">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="container max-w-lg py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold">Resume saved!</h2>
        <p className="text-sm text-ink-muted mt-2 mb-6">
          Your {template.toLowerCase()} resume has been saved. PDF export is coming soon.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setStep("fill")}>Edit resume</Button>
          <Button onClick={() => { setStep("pick"); setSavedId(null); }}>New resume</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <button onClick={() => setStep("pick")} className="text-xs text-ink-muted hover:text-ink mb-4">← Change template</button>
      <h1 className="font-display text-xl font-semibold mb-5">
        {TEMPLATES.find((t) => t.id === template)?.emoji} {template} Resume
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="pt-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Personal Info</p>
            <Input name="name" placeholder="Full name" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input name="linkedin" placeholder="LinkedIn URL" />
              <Input name="github" placeholder="GitHub URL" />
            </div>
          </CardContent>
        </Card>

        {[
          { name: "objective", label: "Career Objective / Summary", placeholder: "2-3 lines about your goal and strengths…" },
          { name: "education", label: "Education", placeholder: "B.Tech CSE — XYZ University (CGPA: 8.5)\nClass XII — ABC School (95%)" },
          { name: "skills", label: "Skills", placeholder: "Languages: C++, Python, Java\nTools: Git, VS Code, Linux\nFrameworks: React, Node.js" },
          { name: "experience", label: "Experience / Internships", placeholder: "SDE Intern — Company Name (Jun–Aug 2024)\n• Built X feature that improved Y by Z%" },
          { name: "projects", label: "Projects", placeholder: "Project Name | Tech Stack | Link\n• Description of what you built and its impact" },
          { name: "achievements", label: "Achievements & Awards", placeholder: "• GATE 2024 — AIR 1500 (Score: 680)\n• Winner — Hackathon XYZ 2023" },
        ].map((field) => (
          <Card key={field.name}>
            <CardContent className="pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">{field.label}</p>
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-md border border-border bg-surface p-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </CardContent>
          </Card>
        ))}

        <Button type="submit" className="w-full" size="lg" disabled={saving}>
          {saving ? "Saving…" : "Save Resume"}
        </Button>
      </form>
    </div>
  );
}
