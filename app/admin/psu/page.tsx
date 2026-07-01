import { Metadata } from "next";
import PSUForm from "@/components/admin/PSUForm";
import PSUTable from "@/components/admin/PSUTable";
import { listAdminPSUs } from "./actions";

export const metadata: Metadata = {
  title: "PSU Management - Admin",
};

export const dynamic = "force-dynamic";

export default async function PSUAdminPage() {
  const psus = await listAdminPSUs();

  return (
    <div className="space-y-6">

      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            PSU Management
          </h1>

          <p className="text-sm text-muted-foreground">
            Create, update and manage PSU companies
          </p>
        </div>

        {/* FORM BUTTON / MODAL TRIGGER */}
        <div className="flex justify-end">
          <PSUForm />
        </div>

      </div>

      {/* ───────────────── TABLE ───────────────── */}
      <div className="rounded-lg border border-border bg-surface p-3 md:p-4 shadow-sm">

        <PSUTable data={psus} />

      </div>

    </div>
  );
}