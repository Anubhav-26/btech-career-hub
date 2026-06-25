import type { Metadata } from "next";
import Link from "next/link";
import { listResources, toResourceCardItem } from "@/services/resourceService";
import { ResourceFilters } from "@/components/resource/ResourceFilters";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import type { Branch, ResourceType } from "@prisma/client";

export const metadata: Metadata = { title: "Resource Hub" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    examSlug?: string;
    branch?: string;
    subject?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const pageSize = 20;

  const { items, total } = await listResources({
    examSlug: sp.examSlug || undefined,
    branch: (sp.branch as Branch) || undefined,
    subject: sp.subject || undefined,
    type: (sp.type as ResourceType) || undefined,
    page,
    pageSize,
  });

  const cards = items.map(toResourceCardItem);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container py-6 md:py-8">
      <h1 className="font-display text-xl font-semibold">Resource Hub</h1>
      <p className="mt-1 text-sm text-ink-muted">Notes, formula sheets, books and reference PDFs — filter by exam, branch, subject or type.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <ResourceFilters />

        <div>
          {cards.length === 0 ? (
            <EmptyState
              icon={FileQuestion}
              title="No resources match those filters"
              description="Try widening your filters, or check back soon — new notes are added regularly."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((item) => (
                  <ResourceCard key={item.id} item={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button key={p} asChild size="sm" variant={p === page ? "default" : "outline"}>
                      <Link
                        href={`/resources?${new URLSearchParams({ ...sp, page: String(p) } as Record<string, string>).toString()}`}
                      >
                        {p}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
