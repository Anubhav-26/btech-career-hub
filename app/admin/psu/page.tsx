import { Metadata } from "next";
import PSUTable from "@/components/admin/PSUTable";
import PSUForm from "@/components/admin/PSUForm";
import { listAdminPSUs } from "./actions";

export const metadata: Metadata = {
  title: "PSU Management",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const psus = await listAdminPSUs();

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">PSU Management</h1>
      </div>

      <div className="rounded border p-4">
        <PSUForm mode="create" />
      </div>

      <div className="rounded border p-4">
        <PSUTable data={psus} />
      </div>

    </div>
  );
}