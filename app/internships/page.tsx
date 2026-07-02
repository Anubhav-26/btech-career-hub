import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MapPin, Clock, Briefcase } from "lucide-react";

import { listInternships } from "@/services/phase2";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "Internship Hub",
};

export const dynamic = "force-dynamic";

const MODE_BADGE: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

const SOURCES = [
  "Internshala",
  "LinkedIn",
  "Wellfound",
  "Company Careers",
  "Naukri.com",
];

type SearchParams = Promise<{
  workMode?: string;
  branch?: string;
}>;

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};

  const { items = [], total = 0 } = await listInternships({
    workMode: sp.workMode,
    branch: sp.branch,
  });

  return (
    <div className="container py-6 md:py-8">

      {/* HEADER */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Internship Hub
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Curated internships from {SOURCES.join(", ")}
        </p>

        <p className="mt-2 text-xs text-ink-muted">
          Total listings: <span className="font-medium">{total}</span>
        </p>
      </div>

      {/* FILTERS */}
      <div className="mt-5 flex flex-wrap gap-2">
        {["REMOTE", "HYBRID", "ONSITE"].map((mode) => {
          const active = sp.workMode === mode;

          return (
            <Link
              key={mode}
              href={
                active
                  ? "/internships"
                  : `/internships?workMode=${mode}`
              }
              className={`rounded-full border px-3 py-1 text-xs font-medium transition
              ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-ink-muted hover:bg-muted"
              }`}
            >
              {MODE_BADGE[mode]}
            </Link>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Briefcase}
            title="No internships available"
            description="New opportunities will appear here soon."
          />
        </div>
      ) : (
        /* GRID */
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-2 p-4">

                {/* TITLE */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{i.title}</p>
                    <p className="text-sm text-ink-muted">
                      {i.company}
                    </p>
                  </div>

                  <Badge variant="outline">
                    {MODE_BADGE[String(i.workMode)] ?? i.workMode}
                  </Badge>
                </div>

                {/* DETAILS */}
                <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {i.location ?? "Remote"}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {i.duration ?? "Flexible"}
                  </span>

                  {(i.stipendMin != null || i.stipendMax != null) && (
                    <span className="font-medium text-primary">
                      ₹{i.stipendMin ?? 0}
                      {i.stipendMax ? ` - ₹${i.stipendMax}` : ""}
                    </span>
                  )}
                </div>

                {/* DEADLINE */}
                {i.deadline && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Deadline:{" "}
                    {new Date(i.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}

                {/* CTA */}
                <a
                  href={i.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Apply Now
                  <ExternalLink className="h-3 w-3" />
                </a>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}