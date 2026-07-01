import type { Metadata } from "next";
import Link from "next/link";
import {
  ListChecks,
  FileText,
  MessagesSquare,
  Building2,
 ArrowRight,
  Briefcase,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { listCompanies } from "@/services/resourceService";
import { CompanyCard } from "@/components/placement/CompanyCard";
import { IndexChip } from "@/components/shared/IndexChip";

export const metadata: Metadata = {
  title: "Placement Hub",
};

const SECTIONS = [
  {
    href: "/placements/tracker",
    icon: Briefcase,
    title: "Placement Tracker",
    blurb: "Track every company from Applied to Offer Letter.",
  },
  {
    href: "/placements/dsa-roadmap",
    icon: ListChecks,
    title: "DSA Roadmap",
    blurb:
      "A step-by-step Data Structures & Algorithms roadmap with progress tracking.",
  },
  {
    href: "/placements/resume-templates",
    icon: FileText,
    title: "Resume Templates",
    blurb:
      "ATS-friendly resume templates for campus placements.",
  },
  {
    href: "/placements/interview-questions",
    icon: MessagesSquare,
    title: "Interview Questions",
    blurb:
      "Technical, HR and branch-wise interview questions.",
  },
  {
    href: "/placements/companies",
    icon: Building2,
    title: "Company Guides",
    blurb:
      "Hiring process, OA rounds and interview experience of top companies.",
  },
];

export default async function PlacementsPage() {
  const topCompanies = await listCompanies({
    companyType: "PLACEMENT",
  });

  return (
    <div className="container py-6 md:py-8">
      <IndexChip>PLC·HUB</IndexChip>

      <h1 className="mt-2 font-display text-2xl font-semibold">
        Placement Hub
      </h1>

      <p className="mt-1 max-w-xl text-sm text-ink-muted">
        Everything required for campus placements in one place — Placement
        Tracker, DSA Roadmap, Resume, Interview Questions and Company Guides.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;

          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <Icon className="h-5 w-5 text-primary" />

                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription>
                    {section.blurb}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Top Recruiters
          </h2>

          <Link
            href="/placements/companies"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {topCompanies.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Company guides are being added...
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCompanies.slice(0, 6).map((company) => (
              <CompanyCard
                key={company.id}
                slug={company.slug}
                name={company.name}
                companyType={company.companyType}
                avgPackageLpa={company.avgPackageLpa}
                recruitsViaGate={company.recruitsViaGate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}