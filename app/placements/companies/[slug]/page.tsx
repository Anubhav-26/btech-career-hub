import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { getCompanyBySlug } from "@/services/resourceService";
import { IndexChip } from "@/components/shared/IndexChip";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: "Company not found" };
  return { title: company.name, description: company.description ?? undefined };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <Link href="/placements/companies" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Company Guides
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <IndexChip>{company.companyType}</IndexChip>
          <h1 className="mt-2 font-display text-2xl font-semibold">{company.name}</h1>
        </div>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {company.recruitsViaGate && <Badge variant="outline">Recruits via GATE</Badge>}
        {company.avgPackageLpa && <Badge variant="accent">{company.avgPackageLpa} LPA avg package</Badge>}
        {company.rolesHiredFor.map((role) => (
          <Badge key={role} variant="muted">
            {role}
          </Badge>
        ))}
      </div>

      {company.description && <p className="mt-6 whitespace-pre-line text-sm text-ink">{company.description}</p>}

      {company.exams.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Related tracks</h2>
          <div className="flex flex-wrap gap-2">
            {company.exams.map(({ exam }) => (
              <Link key={exam.slug} href={`/exam/${exam.slug}`}>
                <IndexChip>{exam.shortTitle}</IndexChip>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
