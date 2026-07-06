import type { Metadata } from "next";

import InternshipForm from "@/components/admin/internshipForm";
import InternshipTable from "@/components/admin/internshipTable";

import { listAdminInternships } from "./actions";

export const metadata: Metadata = {
  title: "Internship Management - Admin",
};

export const dynamic = "force-dynamic";

export default async function InternshipAdminPage() {
  const internships = await listAdminInternships();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Internship Management
          </h1>

          <p className="text-sm text-muted-foreground">
            Create, update and manage internship opportunities.
          </p>
        </div>

        <div className="rounded-lg border bg-muted px-4 py-2 text-sm font-medium">
          Total Internships:{" "}
          <span className="font-bold">
            {internships.length}
          </span>
        </div>
      </div>

      {/* Add Internship */}
      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        <InternshipForm />
      </div>

      {/* Internship Table */}
      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        <InternshipTable data={internships} />
      </div>
    </div>
  );
}