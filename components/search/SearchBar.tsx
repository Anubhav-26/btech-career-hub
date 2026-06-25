"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, GraduationCap, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/services/searchService";

const ICONS: Record<SearchResult["type"], typeof FileText> = {
  exam: GraduationCap,
  resource: FileText,
  pyq: ClipboardList,
  company: GraduationCap,
};

/**
 * Global search + autocomplete. Search examples it's tuned for:
 * "GATE CSE syllabus", "PSU through GATE", "CAT quant notes" — see
 * docs/05-api-endpoints.md §5.1 for the merged-results API contract.
 */
export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((json) => setResults(json.data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search GATE CSE syllabus, CAT notes…"
          className={cn("pl-9", compact ? "h-9" : "h-11")}
        />
      </div>

      {open && (query.trim().length >= 2) && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">
          {loading && <div className="p-3 text-sm text-ink-muted">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-ink-muted">No results for &ldquo;{query}&rdquo;</div>
          )}
          {!loading &&
            results.map((r) => {
              const Icon = ICONS[r.type];
              return (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => {
                    setOpen(false);
                    router.push(r.href);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
                  <span className="flex-1 truncate">{r.title}</span>
                  <span className="shrink-0 text-xs text-ink-muted">{r.subtitle}</span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
