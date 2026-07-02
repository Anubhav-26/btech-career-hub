import type { Metadata } from "next";
import Link from "next/link";
import {
  listResources,
  listVideos,
  toResourceCardItem,
  toVideoCardItem,
} from "@/services/resourceService";
import { ResourceFilters } from "@/components/resource/ResourceFilters";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import type { Branch, ResourceType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Resource Hub",
};

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

export default async function ResourcesPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;

  const page = Number(sp.page ?? "1") || 1;
  const pageSize = 20;

  const [resourceResult, videos] = await Promise.all([
    listResources({
      examSlug: sp.examSlug || undefined,
      branch: (sp.branch as Branch) || undefined,
      subject: sp.subject || undefined,
      type: (sp.type as ResourceType) || undefined,
      page,
      pageSize,
    }),

    listVideos({
      examSlug: sp.examSlug || undefined,
      subject: sp.subject || undefined,
    }),
  ]);

  const cards = [
    ...resourceResult.items.map(toResourceCardItem),
    ...videos.map(toVideoCardItem),
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(resourceResult.total / pageSize)
  );

  return (
    <div className="container py-6 md:py-8">
      <h1 className="font-display text-xl font-semibold">
        Resource Hub
      </h1>

      <p className="mt-1 text-sm text-ink-muted">
        Notes, Formula Sheets, Books, PDFs and Video Lectures.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <ResourceFilters />

        <div>
          {cards.length === 0 ? (
            <EmptyState
              icon={FileQuestion}
              title="No resources found"
              description="Try changing the filters or check back later."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((item) => (
                  <ResourceCard
                    key={`${item.kind}-${item.id}`}
                    item={item}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <Button
                      key={p}
                      asChild
                      size="sm"
                      variant={p === page ? "default" : "outline"}
                    >
                      <Link
                        href={`/resources?${new URLSearchParams({
                          ...sp,
                          page: String(p),
                        } as Record<string, string>).toString()}`}
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