"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";

interface StudyHeatmapProps {
  heatmap: Record<string, number>; // { "2025-01-15": 90 }
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

function intensityClass(minutes: number): string {
  if (minutes === 0) return "bg-muted";
  if (minutes < 30) return "bg-primary/20";
  if (minutes < 60) return "bg-primary/40";
  if (minutes < 120) return "bg-primary/70";
  return "bg-primary";
}

/** Builds the last `weeks` × 7 day grid, Sunday-first */
function buildGrid(heatmap: Record<string, number>, weeks = 26) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Align to Sunday
  const dayOfWeek = today.getDay();
  const gridEnd = new Date(today);
  gridEnd.setDate(today.getDate() - dayOfWeek + 6); // last Saturday

  const cells: { date: string; minutes: number; col: number; row: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridEnd);
      date.setDate(gridEnd.getDate() - w * 7 - (6 - d));
      const key = date.toISOString().split("T")[0];
      cells.push({ date: key, minutes: heatmap[key] ?? 0, col: weeks - 1 - w, row: d });
    }
  }
  return cells;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function StudyHeatmap({ heatmap, currentStreak, longestStreak, totalActiveDays }: StudyHeatmapProps) {
  const grid = useMemo(() => buildGrid(heatmap, 26), [heatmap]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    const labels: { col: number; label: string }[] = [];
    for (const cell of grid) {
      const month = cell.date.slice(0, 7);
      if (!seen.has(month)) {
        seen.add(month);
        labels.push({ col: cell.col, label: MONTH_LABELS[Number(cell.date.slice(5, 7)) - 1] });
      }
    }
    return labels;
  }, [grid]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Study Activity</p>
        <IndexChip>LAST 6M</IndexChip>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-max">
            {/* Month labels */}
            <div className="mb-1 flex gap-[3px] pl-5">
              {Array.from({ length: 26 }, (_, i) => {
                const label = monthLabels.find((m) => m.col === i);
                return (
                  <div key={i} className="w-[11px] text-[9px] text-ink-muted">
                    {label?.label ?? ""}
                  </div>
                );
              })}
            </div>

            {/* Grid + day labels */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] pr-1">
                {DAY_LABELS.map((d, i) => (
                  <div key={i} className="h-[11px] text-[9px] leading-none text-ink-muted">
                    {i % 2 === 1 ? d : ""}
                  </div>
                ))}
              </div>
              {/* Heatmap cells */}
              {Array.from({ length: 26 }, (_, col) => (
                <div key={col} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, row) => {
                    const cell = grid.find((c) => c.col === col && c.row === row);
                    return (
                      <div
                        key={row}
                        title={cell ? `${cell.date}: ${cell.minutes} min` : ""}
                        className={cn("h-[11px] w-[11px] rounded-[2px]", intensityClass(cell?.minutes ?? 0))}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
          <div>
            <p className="stat-number text-lg font-semibold text-primary">{currentStreak}</p>
            <p className="text-xs text-ink-muted">Current streak</p>
          </div>
          <div>
            <p className="stat-number text-lg font-semibold text-primary">{longestStreak}</p>
            <p className="text-xs text-ink-muted">Longest streak</p>
          </div>
          <div>
            <p className="stat-number text-lg font-semibold text-primary">{totalActiveDays}</p>
            <p className="text-xs text-ink-muted">Active days</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-ink-muted">
          <span>Less</span>
          {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/70", "bg-primary"].map((c) => (
            <div key={c} className={cn("h-[10px] w-[10px] rounded-[2px]", c)} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
