"use client";

import { deletePSU } from "@/app/admin/psu/actions";
import { Button } from "@/components/ui/button";

export default function PSUTable({ data }: any) {
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this PSU?")) return;

    await deletePSU(id);
    window.location.reload();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Sector</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Branches</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((psu: any) => (
            <tr key={psu.id} className="border-t">
              <td className="p-2 font-medium">{psu.name}</td>
              <td className="p-2">{psu.sector}</td>
              <td className="p-2">{psu.avgSalaryLpa ?? "-"}</td>
              <td className="p-2">
                {psu.branches?.join(", ")}
              </td>

              <td className="p-2 flex gap-2">
                <Button size="sm" variant="destructive"
                  onClick={() => handleDelete(psu.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}