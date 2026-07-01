"use client";

import { useState } from "react";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const STATUSES = [
  { key: "APPLIED", label: "Applied", color: "muted" },
  { key: "OA_CLEARED", label: "OA Cleared", color: "outline" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview", color: "accent" },
  { key: "SELECTED", label: "Selected ✅", color: "accent" },
  { key: "REJECTED", label: "Rejected", color: "muted" },
] as const;

const TOP_COMPANIES = ["Google", "Microsoft", "Amazon", "Atlassian", "Adobe", "Flipkart", "Walmart", "TCS", "Infosys", "Wipro", "Other"];

interface App {
  id: string;
  companyName: string;
  role: string;
  status: string;
  appliedAt: string;
  ctcOffered: number | null;
  jobLink: string | null;
  notes: string | null;
}

interface Stats { APPLIED: number; OA_CLEARED: number; INTERVIEW_SCHEDULED: number; SELECTED: number; REJECTED: number; total: number }

function AddAppDialog({ onAdded }: { onAdded: (app: App) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { getIdToken } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const token = await getIdToken();
    const res = await fetch("/api/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        companyName: form.get("companyName"),
        role: form.get("role"),
        status: "APPLIED",
        jobLink: form.get("jobLink") || undefined,
        notes: form.get("notes") || undefined,
      }),
    });
    const json = await res.json();
    if (res.ok) { onAdded(json.data); setOpen(false); }
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" /> Add company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Track a new application</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <select name="companyName" required className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
            <option value="">Select company</option>
            {TOP_COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input name="role" placeholder="Role (e.g. SDE Intern)" required />
          <Input name="jobLink" type="url" placeholder="Job link (optional)" />
          <textarea name="notes" placeholder="Notes (optional)" rows={2} className="w-full rounded-md border border-border bg-surface p-2 text-sm" />
          <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PlacementBoard({ initialApps, stats: initialStats }: { initialApps: App[]; stats: Stats }) {
  const [apps, setApps] = useState(initialApps);
  const { getIdToken } = useAuth();

  async function updateStatus(id: string, status: string) {
    const token = await getIdToken();
    await fetch(`/api/placements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function deleteApp(id: string) {
    const token = await getIdToken();
    await fetch(`/api/placements/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3 text-xs text-ink-muted">
          <span><strong className="stat-number text-ink">{apps.length}</strong> total</span>
          <span><strong className="stat-number text-primary">{apps.filter((a) => a.status === "SELECTED").length}</strong> offers</span>
        </div>
        <AddAppDialog onAdded={(app) => setApps((prev) => [app, ...prev])} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATUSES.map((col) => {
          const colApps = apps.filter((a) => a.status === col.key);
          return (
            <div key={col.key} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{col.label}</p>
                <span className="stat-number text-xs font-semibold text-primary">{colApps.length}</span>
              </div>
              <div className="space-y-2">
                {colApps.map((app) => (
                  <Card key={app.id} className="cursor-default">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{app.companyName}</p>
                          <p className="truncate text-xs text-ink-muted">{app.role}</p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {app.jobLink && (
                            <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5 text-ink-muted hover:text-primary" />
                            </a>
                          )}
                          <button onClick={() => deleteApp(app.id)} className="text-ink-muted hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {app.ctcOffered && (
                        <p className="mt-1 text-xs font-medium text-primary">₹{app.ctcOffered}L CTC</p>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="mt-2 w-full rounded border border-border bg-surface px-1 py-0.5 text-xs"
                      >
                        {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </CardContent>
                  </Card>
                ))}
                {colApps.length === 0 && (
                  <p className="py-4 text-center text-xs text-ink-muted">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
