import type { Metadata } from "next";
import { listPSUs } from "@/services/phase2";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "PSU Hub",
};

export const dynamic = "force-dynamic";

export default async function PSUHubPage() {
  const psus = await listPSUs({});

  return (
    <div className="container py-6 md:py-8">

      {/* HEADER */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          PSU Hub
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Public Sector Undertakings recruiting via GATE — salaries,
          cutoffs, and selection insights.
        </p>

        <p className="mt-2 text-xs text-ink-muted">
          Total PSUs:{" "}
          <span className="font-medium text-foreground">
            {psus.length}
          </span>
        </p>
      </div>

      {/* EMPTY STATE */}
      {psus.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Building}
            title="PSU data coming soon"
            description="Admin will add PSU profiles, cutoffs and details soon."
          />
        </div>
      ) : (
        /* GRID */
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {psus.map((psu) => (
            <Card key={psu.id} className="flex flex-col">

              {/* HEADER */}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold">
                      {psu.name}
                    </p>

                    <p className="text-xs text-ink-muted">
                      {psu.sector ?? "Public Sector"}
                    </p>
                  </div>

                  {psu.avgSalaryLpa && (
                    <IndexChip>
                      ₹{psu.avgSalaryLpa} LPA
                    </IndexChip>
                  )}
                </div>
              </CardHeader>

              {/* CONTENT */}
              <CardContent className="flex flex-1 flex-col gap-3">

                {/* BRANCHES */}
                {psu.branches?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {psu.branches.map((branch: string) => (
                      <Badge key={branch} variant="outline">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* GATE SCORE */}
                {psu.minGateScore && (
                  <p className="text-xs text-ink-muted">
                    Min GATE Score:{" "}
                    <span className="font-semibold text-foreground">
                      {psu.minGateScore}
                    </span>
                  </p>
                )}

                {/* DESCRIPTION */}
                {psu.description && (
                  <p className="text-xs text-ink-muted line-clamp-3">
                    {psu.description}
                  </p>
                )}

                {/* SELECTION PROCESS */}
                {psu.selectionProcess && (
                  <div className="border-t pt-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                      Selection Process
                    </p>

                    <p className="text-xs text-ink-muted line-clamp-3">
                      {psu.selectionProcess}
                    </p>
                  </div>
                )}

                {/* CUTOFFS */}
                {psu.cutoffs?.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                      Latest Cutoffs
                    </p>

                    {psu.cutoffs.slice(0, 3).map((cutoff: any) => (
                      <p key={cutoff.id} className="text-xs">
                        <span className="font-medium">
                          {cutoff.branch}
                        </span>{" "}
                        ({cutoff.year}) —{" "}
                        <span className="font-semibold text-primary">
                          {cutoff.gateScore}
                        </span>
                      </p>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}