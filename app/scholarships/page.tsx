import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Calendar, IndianRupee, BookMarked } from "lucide-react";
import { listScholarships } from "@/services/phase2";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { IndexChip } from "@/components/shared/IndexChip";

export const metadata: Metadata = { title: "Scholarship Hub" };
export const dynamic = "force-dynamic";

interface PageProps { searchParams: Promise<{ type?: string; branch?: string }> }

const TYPE_LABEL: Record<string, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  INTERNATIONAL: "International",
  INSTITUTIONAL: "Institutional",
};

const TYPE_COLORS: Record<string, string> = {
  GOVERNMENT: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
  PRIVATE: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
  INTERNATIONAL: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
  INSTITUTIONAL: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20",
};

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const scholarships = await listScholarships({
    type: sp.type,
    branch: sp.branch,
  });

  const types = ["GOVERNMENT", "PRIVATE", "INTERNATIONAL", "INSTITUTIONAL"] as const;

  return (
    <div className="container py-6 md:py-8">
      <div className="flex items-center gap-2 mb-1">
        <BookMarked className="h-5 w-5 text-primary" />
        <h1 className="font-display text-2xl font-semibold">Scholarship Hub</h1>
      </div>
      <p className="mt-1 text-sm text-ink-muted mb-5">
        Government, private and international scholarships for B.Tech students.
      </p>

      {/* Type filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-6">
        <Link href="/scholarships"
          className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${!sp.type ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-muted hover:bg-muted"}`}>
          All
        </Link>
        {types.map((t) => (
          <Link key={t} href={`/scholarships?type=${t}`}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${sp.type === t ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-muted hover:bg-muted"}`}>
            {TYPE_LABEL[t]}
          </Link>
        ))}
      </div>

      {scholarships.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No scholarships found"
          description="Scholarship listings are being added. Check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s: {
            id: string; title: string; provider: string; type: string;
            amount: string; deadline: Date | null; eligibility: string;
            applyLink: string; isActive: boolean; branches: string[];
            description: string | null;
          }) => {
            const daysLeft = s.deadline
              ? Math.ceil((s.deadline.getTime() - Date.now()) / 86400000)
              : null;

            return (
              <Card key={s.id} className={`overflow-hidden ${TYPE_COLORS[s.type] ?? ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <IndexChip>{TYPE_LABEL[s.type] ?? s.type}</IndexChip>
                    {daysLeft !== null && (
                      <span className={`stat-number text-xs font-semibold ${daysLeft <= 7 ? "text-destructive" : "text-ink-muted"}`}>
                        {daysLeft > 0 ? `${daysLeft}d left` : "Closed"}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-display font-semibold text-sm leading-tight">{s.title}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{s.provider}</p>

                  {s.description && (
                    <p className="mt-2 text-xs text-ink line-clamp-2">{s.description}</p>
                  )}

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <IndianRupee className="h-3 w-3 text-ink-muted shrink-0" />
                      <span className="font-medium">{s.amount}</span>
                    </div>
                    {s.deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>Deadline: {s.deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>

                  {s.branches.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.branches.slice(0, 3).map((b) => (
                        <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>
                      ))}
                      {s.branches.length > 3 && (
                        <span className="text-[10px] text-ink-muted">+{s.branches.length - 3}</span>
                      )}
                    </div>
                  )}

                  <a
                    href={s.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Apply / Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
