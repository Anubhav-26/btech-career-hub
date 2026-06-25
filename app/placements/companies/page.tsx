import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { listCompanies } from "@/services/resourceService";
import { CompanyCard } from "@/components/placement/CompanyCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Company Guides" };
export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [psus, placements] = await Promise.all([
    listCompanies({ companyType: "PSU" }),
    listCompanies({ companyType: "PLACEMENT" }),
  ]);

  return (
    <div className="container max-w-3xl py-6 md:py-8">
      <Link href="/placements" className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Placement Hub
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold">Company Guides</h1>
      <p className="mt-1 text-sm text-ink-muted">Hiring process, rounds, and prep notes by company.</p>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">PSU Recruiters</h2>
        {psus.length === 0 ? (
          <EmptyState icon={Building2} title="No PSU guides yet" description="PSU recruiter profiles are being added." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {psus.map((c) => (
              <CompanyCard key={c.id} slug={c.slug} name={c.name} companyType={c.companyType} avgPackageLpa={c.avgPackageLpa} recruitsViaGate={c.recruitsViaGate} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Campus Placement Recruiters</h2>
        {placements.length === 0 ? (
          <EmptyState icon={Building2} title="No placement guides yet" description="Recruiter profiles are being added." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {placements.map((c) => (
              <CompanyCard key={c.id} slug={c.slug} name={c.name} companyType={c.companyType} avgPackageLpa={c.avgPackageLpa} recruitsViaGate={c.recruitsViaGate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
