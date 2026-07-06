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
        <h1 className="font-display text-2xl font-semibold text-foreground">
          PSU Hub
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Public Sector Undertakings recruiting via GATE — salaries,
          cutoffs, and selection insights.
        </p>

        <p className="mt-2 text-xs text-ink-muted">
          Total PSUs:{" "}
          <span className="font-semibold text-foreground">
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
                    {/* 🔥 PSU NAME */}
                    <p className="font-display font-semibold text-foreground">
                      {psu.name}
                    </p>

                    <p className="text-xs text-ink-muted">
                      {psu.sector ?? "Public Sector"}
                    </p>
                  </div>

                  {/* 💰 SALARY */}
                  {psu.avgSalaryLpa && (
                    <IndexChip>
                      <span className="text-emerald-600 font-semibold">
                        ₹{psu.avgSalaryLpa} LPA
                      </span>
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
                      <Badge key={branch} variant="outline" className="text-xs text-ink-muted">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 🎯 GATE SCORE */}
                {psu.minGateScore && (
                  <p className="text-xs text-ink-muted">
                    Min GATE Score:{" "}
                    <span className="font-semibold text-amber-600">
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
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-ink-muted">
                      Selection Process
                    </p>

                    <p className="text-xs text-ink-muted line-clamp-2">
                      {psu.selectionProcess}
                    </p>
                  </div>
                )}

                {/* 🔗 OFFICIAL LINK (CLEAN + PROFESSIONAL) */}
                {psu.officialUrl && (
                  <div className="border-t pt-2 flex items-center justify-between">
                    
                    <span className="text-[10px] text-ink-muted uppercase tracking-wide">
                      Official
                    </span>

                    <a
                      href={psu.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Visit →
                    </a>

                  </div>
                )}

                {/* CUTOFFS */}
                {psu.cutoffs?.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="mb-2 text-[10px] uppercase tracking-wide text-ink-muted">
                      Latest Cutoffs
                    </p>

                    {psu.cutoffs.slice(0, 3).map((cutoff: any) => (
                      <p key={cutoff.id} className="text-xs">
                        <span className="font-medium text-foreground">
                          {cutoff.branch}
                        </span>{" "}
                        <span className="text-ink-muted">
                          ({cutoff.year})
                        </span>{" "}
                        —{" "}
                        <span className="font-semibold text-emerald-600">
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