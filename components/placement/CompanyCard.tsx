import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export interface CompanyCardProps {
  slug: string;
  name: string;
  companyType: "PSU" | "PLACEMENT";
  avgPackageLpa?: number | null;
  recruitsViaGate?: boolean | null;
}

export function CompanyCard({ slug, name, companyType, avgPackageLpa, recruitsViaGate }: CompanyCardProps) {
  return (
    <Link href={`/placements/companies/${slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Building2 className="h-5 w-5 text-ink-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{name}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="muted">{companyType === "PSU" ? "PSU" : "Placement"}</Badge>
              {recruitsViaGate && <Badge variant="outline">Via GATE</Badge>}
              {avgPackageLpa && <Badge variant="accent">{avgPackageLpa} LPA avg</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
