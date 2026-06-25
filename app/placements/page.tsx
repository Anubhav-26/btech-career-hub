import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks, FileText, MessagesSquare, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { listCompanies } from "@/services/resourceService";
import { CompanyCard } from "@/components/placement/CompanyCard";
import { IndexChip } from "@/components/shared/IndexChip";

export const metadata: Metadata = { title: "Placement Hub" };

const SECTIONS = [
  {
    href: "/placements/dsa-roadmap",
    icon: ListChecks,
    title: "DSA Roadmap",
    blurb: "A step-by-step data structures & algorithms plan with progress tracking.",
  },
  {
    href: "/placements/resume-templates",
    icon: FileText,
    title: "Resume Templates",
    blurb: "ATS-friendly templates built for Indian campus placement formats.",
  },
  {
    href: "/placements/interview-questions",
    icon: MessagesSquare,
    title: "Interview Questions",
    blurb: "Technical, HR, and branch-specific questions asked in real interviews.",
  },
  {
    href: "/placements/companies",
    icon: Building2,
    title: "Company Guides",
    blurb: "Hiring process, rounds, and prep notes for top campus recruiters.",
  },
];

export default async function PlacementsPage() {
  const topCompanies = await listCompanies({ companyType: "PLACEMENT" });

  return (
    <div className="container py-6 md:py-8">
      <IndexChip>PLC·HUB</IndexChip>
      <h1 className="mt-2 font-display text-2xl font-semibold">Placement Hub</h1>
      <p className="mt-1 max-w-lg text-sm text-ink-muted">
        Everything for campus placements in one place — roadmap, resume, interviews, and
        company-specific prep.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <s.icon className="h-5 w-5 shrink-0 text-primary" />
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{s.blurb}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Top recruiters</h2>
          <Link href="/placements/companies" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {topCompanies.length === 0 ? (
          <p className="text-sm text-ink-muted">Company guides are being added — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCompanies.slice(0, 6).map((c) => (
              <CompanyCard
                key={c.id}
                slug={c.slug}
                name={c.name}
                companyType={c.companyType}
                avgPackageLpa={c.avgPackageLpa}
                recruitsViaGate={c.recruitsViaGate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
