import { ExamCard } from "@/components/exam/ExamCard";
import type { ExamCategory } from "@prisma/client";

export interface RecommendedExamsProps {
  exams: Array<{ id: string; slug: string; shortTitle: string; category: ExamCategory; examDate?: string | Date | null }>;
}

export function RecommendedExams({ exams }: RecommendedExamsProps) {
  if (exams.length === 0) {
    return <p className="text-sm text-ink-muted">Complete onboarding to get personalized recommendations.</p>;
  }
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {exams.map((e) => (
        <div key={e.id} className="w-40 shrink-0">
          <ExamCard slug={e.slug} shortTitle={e.shortTitle} category={e.category} examDate={e.examDate} />
        </div>
      ))}
    </div>
  );
}
