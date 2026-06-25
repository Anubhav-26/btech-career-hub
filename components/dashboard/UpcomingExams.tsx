import Link from "next/link";
import { IndexChip } from "@/components/shared/IndexChip";

export interface UpcomingExamsProps {
  exams: Array<{ id: string; slug: string; shortTitle: string; examDate: string | Date; daysUntil: number }>;
}

export function UpcomingExams({ exams }: UpcomingExamsProps) {
  if (exams.length === 0) {
    return <p className="text-sm text-ink-muted">No upcoming exam dates published yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {exams.map((e) => (
        <li key={e.id}>
          <Link
            href={`/exam/${e.slug}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <IndexChip>{e.shortTitle}</IndexChip>
              <span className="text-ink-muted">
                {new Date(e.examDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
            </div>
            <span className="stat-number font-medium text-accent">{e.daysUntil} days</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
