"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/select";

const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "CHEMICAL", "OTHER"];
const TYPES = ["NOTES", "FORMULA_SHEET", "BOOK", "PDF", "LINK"];
const EXAMS = [
  { slug: "gate-cse", label: "GATE CSE" },
  { slug: "psu", label: "PSU" },
  { slug: "cat", label: "CAT" },
  { slug: "placements", label: "Placements" },
];

export function ResourceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:flex-col md:overflow-visible">
      <Select
        value={searchParams.get("examSlug") ?? ""}
        onChange={(e) => setParam("examSlug", e.target.value)}
        className="shrink-0"
      >
        <option value="">All exams</option>
        {EXAMS.map((e) => (
          <option key={e.slug} value={e.slug}>
            {e.label}
          </option>
        ))}
      </Select>

      <Select
        value={searchParams.get("branch") ?? ""}
        onChange={(e) => setParam("branch", e.target.value)}
        className="shrink-0"
      >
        <option value="">All branches</option>
        {BRANCHES.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Select>

      <Select
        value={searchParams.get("type") ?? ""}
        onChange={(e) => setParam("type", e.target.value)}
        className="shrink-0"
      >
        <option value="">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </Select>

      <input
        placeholder="Subject…"
        defaultValue={searchParams.get("subject") ?? ""}
        onBlur={(e) => setParam("subject", e.target.value)}
        className="h-9 shrink-0 rounded-md border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-full"
      />
    </div>
  );
}
