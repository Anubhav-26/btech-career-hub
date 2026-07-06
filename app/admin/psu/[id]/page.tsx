import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import PSUForm from "@/components/admin/PSUForm";

export default async function EditPSUPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const psu = await prisma.pSUCompany.findUnique({
    where: {
      id,
    },
  });

  if (!psu) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PSUForm
        mode="edit"
        psu={{
          id: psu.id,
          name: psu.name,
          sector: psu.sector,
          avgSalaryLpa: psu.avgSalaryLpa ?? 0,
          maxSalaryLpa: psu.maxSalaryLpa ?? 0,
          minGateScore: psu.minGateScore ?? 0,
          branches: psu.branches,
          officialUrl: psu.officialUrl ?? "",
          logoUrl: psu.logoUrl ?? "",
          description: psu.description ?? "",
          selectionProcess: psu.selectionProcess ?? "",
        }}
      />
    </div>
  );
}