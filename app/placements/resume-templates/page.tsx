import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { listResources, toResourceCardItem } from "@/services/resourceService";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Resume Templates" };
export const dynamic = "force-dynamic";

export default async function ResumeTemplatesPage() {
  const { items } = await listResources({ examSlug: "placements", subject: "Resume", page: 1, pageSize: 50 });
  const cards = items.map(toResourceCardItem);

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <Link href="/placements" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Placement Hub
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold">Resume Templates</h1>
      <p className="mt-1 text-sm text-ink-muted">
        ATS-friendly, one-page formats reviewed against campus placement conventions.
      </p>

      <div className="mt-6">
        {cards.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Templates coming soon"
            description="Resume templates are being added — check back shortly."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cards.map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
