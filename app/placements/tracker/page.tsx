import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { getPlacementApplications, getPlacementStats } from "@/services/phase2";
import { PlacementBoard } from "@/components/phase2/PlacementBoard";

export const metadata: Metadata = { title: "Placement Tracker" };
export const dynamic = "force-dynamic";

export default async function PlacementTrackerPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/placements/tracker");

  const [apps, stats] = await Promise.all([
    getPlacementApplications(user.id),
    getPlacementStats(user.id),
  ]);

  return (
    <div className="container py-6 md:py-8">
      <h1 className="font-display text-2xl font-semibold">
        Placement Tracker
      </h1>

      <p className="mt-1 text-sm text-ink-muted">
        Track every company — from applied to offer.
      </p>

      <PlacementBoard
        initialApps={apps.map((a) => ({
          id: a.id,
          companyName: a.companyName,
          role: a.role,
          status: a.status,
          appliedAt: a.appliedAt ? a.appliedAt.toISOString() : "",
          ctcOffered: a.ctcOffered,
          jobLink: a.jobLink,
          notes: a.notes,
        }))}
        stats={stats}
      />
    </div>
  );
}