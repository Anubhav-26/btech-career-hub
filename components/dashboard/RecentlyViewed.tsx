import Link from "next/link";
import { Clock } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

export interface RecentlyViewedProps {
  items: Array<{ id: string; title: string; href: string; viewedAt: string | Date }>;
}

export function RecentlyViewed({ items }: RecentlyViewedProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Nothing viewed yet"
        description="Open a syllabus, PYQ, or video and it'll show up here so you can pick up where you left off."
      />
    );
  }
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={item.href} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-primary">
            <span className="truncate">{item.title}</span>
            <span className="shrink-0 text-xs text-ink-muted">{timeAgo(item.viewedAt)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
