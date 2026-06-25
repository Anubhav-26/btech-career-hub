import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getExamBySlug } from "@/services/examService";
import { getServerUser } from "@/lib/auth";
import { getCompletedStepIds } from "@/services/progressService";
import { RoadmapStepList } from "@/components/placement/RoadmapStepList";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListChecks } from "lucide-react";

export const metadata: Metadata = { title: "DSA Roadmap" };
export const dynamic = "force-dynamic";

export default async function DsaRoadmapPage() {
  const exam = await getExamBySlug("placements");
  const roadmap = exam?.roadmaps.find((r) => r.title.toLowerCase().includes("dsa")) ?? exam?.roadmaps[0];

  const user = await getServerUser();
  const completedStepIds = user && roadmap ? await getCompletedStepIds(user.id, roadmap.id) : [];

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <Link href="/placements" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Placement Hub
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold">DSA Roadmap</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {roadmap?.description ?? "A structured path through data structures and algorithms for placement interviews."}
      </p>

      <div className="mt-6">
        {!roadmap || roadmap.steps.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Roadmap coming soon"
            description="The DSA roadmap is being put together — check back shortly."
          />
        ) : (
          <RoadmapStepList steps={roadmap.steps} completedStepIds={completedStepIds} />
        )}
      </div>
    </div>
  );
}
