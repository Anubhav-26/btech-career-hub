import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";
import { daysUntil } from "@/lib/utils";
import type { ExamCategory } from "@prisma/client";

export interface ExamCardProps {
  slug: string;
  shortTitle: string;
  category: ExamCategory;
  examDate?: string | Date | null;
}

export function ExamCard({ slug, shortTitle, category, examDate }: ExamCardProps) {
  const days = examDate ? daysUntil(examDate) : null;
  return (
    <Link href={`/exam/${slug}`} className="block min-w-[160px]">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <IndexChip className="w-fit">{category}</IndexChip>
          <CardTitle>{shortTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {days !== null && days >= 0 ? (
            <p className="stat-number text-xs text-ink-muted">{days} days to go</p>
          ) : (
            <p className="text-xs text-ink-muted">View overview, syllabus & PYQs</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
