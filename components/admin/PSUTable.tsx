"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePSU } from "@/app/admin/psu/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PSU = {
  id: string;
  name: string;
  sector: string;
  avgSalaryLpa: number | null;
  maxSalaryLpa: number | null;
  minGateScore: number | null;
  officialUrl: string | null;
  isActive: boolean;
  branches: string[];
};

export default function PSUTable({ data }: { data: PSU[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return data.filter((p) =>
      (p.name + p.sector).toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  function handleDelete(id: string) {
    if (!confirm("Delete this PSU?")) return;

    startTransition(async () => {
      await deletePSU(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 text-white">

      {/* SEARCH */}
      <Input
        placeholder="Search PSU..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400"
      />

      {/* GRID */}
      <div className="grid gap-4 md:grid-cols-2">

        {filtered.map((psu) => (
          <div
            key={psu.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-md transition hover:border-zinc-600"
          >

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">

              <div>
                <h2 className="text-lg font-bold text-white">
                  {psu.name}
                </h2>
                <p className="text-sm text-zinc-400">
                  {psu.sector}
                </p>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  psu.isActive
                    ? "bg-green-900 text-green-300"
                    : "bg-red-900 text-red-300"
                }`}
              >
                {psu.isActive ? "Active" : "Inactive"}
              </span>

            </div>

            {/* SALARY */}
            <div className="mt-3 text-sm text-zinc-300">
              💰{" "}
              {psu.avgSalaryLpa
                ? psu.maxSalaryLpa
                  ? `${psu.avgSalaryLpa} - ${psu.maxSalaryLpa} LPA`
                  : `${psu.avgSalaryLpa} LPA`
                : "Not disclosed"}
            </div>

            {/* GATE */}
            <div className="text-sm text-zinc-300">
              🎯 Min GATE: {psu.minGateScore ?? "N/A"}
            </div>

            {/* BRANCHES */}
            <div className="mt-2 flex flex-wrap gap-1">
              {psu.branches?.map((b, i) => (
                <span
                  key={i}
                  className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* LINKS */}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">

              <a
                href={`/admin/psu/${psu.id}`}
                className="text-blue-400 hover:underline"
              >
                View Details
              </a>

              {psu.officialUrl && (
                <a
                  href={psu.officialUrl}
                  target="_blank"
                  className="text-green-400 hover:underline"
                >
                  Official Site ↗
                </a>
              )}

            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex justify-end gap-2">

              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/admin/psu/${psu.id}`)}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => handleDelete(psu.id)}
              >
                Delete
              </Button>

            </div>

          </div>
        ))}

      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-zinc-400">
          No PSU found
        </p>
      )}
    </div>
  );
}