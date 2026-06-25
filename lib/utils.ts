import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, the standard Shadcn helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2h ago", "3d ago" style relative time for recently-viewed lists. */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Number.POSITIVE_INFINITY, "y"],
  ];
  let value = seconds;
  for (const [div, label] of units) {
    if (value < div) return `${Math.max(1, Math.floor(value))}${label} ago`;
    value = value / div;
  }
  return `${Math.floor(value)}y ago`;
}

/** Days until a future date, used by the "Upcoming Exams" widget. */
export function daysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function formatBranch(branch: string): string {
  const map: Record<string, string> = {
    CSE: "Computer Science",
    ECE: "Electronics & Communication",
    ME: "Mechanical",
    CE: "Civil",
    EE: "Electrical",
    IT: "Information Technology",
    CHEMICAL: "Chemical",
    OTHER: "Other",
  };
  return map[branch] ?? branch;
}
