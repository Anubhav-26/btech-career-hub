"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FileText, GraduationCap, ClipboardList, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";
import Link from "next/link";
import type { SearchResult } from "@/services/searchService";

const ICONS: Record<SearchResult["type"], typeof FileText> = {
  exam: GraduationCap,
  resource: FileText,
  pyq: ClipboardList,
  company: GraduationCap,
};

export function SearchPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set("q", debouncedQuery);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=20`)
      .then((res) => res.json())
      .then((json) => setResults(json.data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exams, notes, PYQs…"
          className="h-11 pl-9"
        />
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-ink-muted">Searching…</p>}

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <EmptyState
            icon={SearchIcon}
            title={`No results for "${query}"`}
            description="Try a different keyword, or browse the Resource Hub directly."
          />
        )}

        {!loading &&
          results.map((r) => {
            const Icon = ICONS[r.type];
            return (
              <Link key={`${r.type}-${r.id}`} href={r.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.title}</p>
                      <p className="truncate text-xs text-ink-muted">{r.subtitle}</p>
                    </div>
                    <IndexChip>{r.type}</IndexChip>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
