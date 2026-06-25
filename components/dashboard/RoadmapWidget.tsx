import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface RoadmapWidgetProps {
  roadmap: {
    title: string;
    percentComplete: number;
    nextStep: { title: string } | null;
    examSlug: string;
  } | null;
}

export function RoadmapWidget({ roadmap }: RoadmapWidgetProps) {
  if (!roadmap) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-ink-muted">
            No active roadmap yet — pick a track on your dashboard to get a step-by-step plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Your Roadmap</p>
        <span className="stat-number text-sm font-semibold text-primary">{roadmap.percentComplete}%</span>
      </CardHeader>
      <CardContent>
        <p className="font-display font-medium">{roadmap.title}</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${roadmap.percentComplete}%` }}
          />
        </div>
        {roadmap.nextStep && (
          <p className="mt-3 text-sm text-ink-muted">
            Next: <span className="text-ink">{roadmap.nextStep.title}</span>
          </p>
        )}
        <Button asChild size="sm" className="mt-4 w-full sm:w-auto">
          <Link href={`/exam/${roadmap.examSlug}?tab=resources`}>
            Continue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
