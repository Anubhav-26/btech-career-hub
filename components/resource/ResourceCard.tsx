import Link from "next/link";
import { FileText, ClipboardList, PlayCircle, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndexChip } from "@/components/shared/IndexChip";
import type { ResourceCardItem } from "@/types";

const ICON_BY_KIND = { RESOURCE: FileText, PYQ: ClipboardList, VIDEO: PlayCircle } as const;

export function ResourceCard({ item }: { item: ResourceCardItem }) {
  const Icon = ICON_BY_KIND[item.kind];
  return (
    <Link
  href={item.href}
  target="_blank"
  rel="noopener noreferrer"
>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex items-start gap-3 p-4">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <IndexChip>{item.examShortTitle}</IndexChip>
              <Badge variant="outline">{item.badgeLabel}</Badge>
            </div>
            <p className="mt-1.5 truncate font-medium leading-snug">{item.title}</p>
            <p className="truncate text-xs text-ink-muted">{item.subtitle}</p>
          </div>
          {item.kind === "RESOURCE" && <Download className="h-4 w-4 shrink-0 text-ink-muted" />}
        </CardContent>
      </Card>
    </Link>
  );
}
