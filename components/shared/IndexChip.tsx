import { cn } from "@/lib/utils";

/**
 * The recurring "roll-number box" motif from docs/01-architecture.md §1.9 —
 * a small monospace index tag in the corner of every exam/resource card,
 * styled after an admit-card roll number cell: thin rule, no shadow.
 * e.g. <IndexChip>GATE·CSE</IndexChip>
 */
export function IndexChip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block rounded border border-border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
