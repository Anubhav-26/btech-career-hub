import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="container py-6 md:py-8">
      <h1 className="font-display text-xl font-semibold">Search</h1>
      <p className="mt-1 text-sm text-ink-muted">Try &ldquo;GATE CSE syllabus&rdquo;, &ldquo;PSU through GATE&rdquo;, or &ldquo;CAT quant notes&rdquo;.</p>
      <div className="mt-5 max-w-xl">
        <Suspense>
          <SearchPageClient />
        </Suspense>
      </div>
    </div>
  );
}
