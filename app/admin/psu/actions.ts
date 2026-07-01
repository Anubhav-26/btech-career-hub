"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminServer } from "@/lib/auth";
import { Branch } from "@prisma/client";

/* ─────────────────────────────
   🔧 SLUG UTILITY
───────────────────────────── */
function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/* ─────────────────────────────
   🔐 BRANCH VALIDATION HELPER
───────────────────────────── */
function normalizeBranches(branches: string[] = []): Branch[] {
  return branches.map((b) => {
    const key = b.toUpperCase();

    if (!Object.values(Branch).includes(key as Branch)) {
      throw new Error(`Invalid branch: ${b}`);
    }

    return key as Branch;
  });
}

/* ─────────────────────────────
   ➕ CREATE PSU
───────────────────────────── */
export async function createPSU(data: {
  name: string;
  sector: string;
  avgSalaryLpa?: number;
  branches: string[];
  minGateScore?: number;
  description?: string;
  selectionProcess?: string;
}) {
  await requireAdminServer();

  return prisma.pSUCompany.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      sector: data.sector,

      avgSalaryLpa: data.avgSalaryLpa ?? null,
      minGateScore: data.minGateScore ?? null,

      description: data.description ?? "",
      selectionProcess: data.selectionProcess ?? "",

      branches: normalizeBranches(data.branches),
    },
  });
}

/* ─────────────────────────────
   ✏️ UPDATE PSU
───────────────────────────── */
export async function updatePSU(
  id: string,
  data: Partial<{
    name: string;
    sector: string;
    avgSalaryLpa: number;
    branches: string[];
    minGateScore: number;
    description: string;
    selectionProcess: string;
  }>
) {
  await requireAdminServer();

  const updateData: any = {
    ...data,
  };

  // slug auto-update if name changes
  if (data.name) {
    updateData.slug = slugify(data.name);
  }

  // branches safe conversion
  if (data.branches) {
    updateData.branches = normalizeBranches(data.branches);
  }

  return prisma.pSUCompany.update({
    where: { id },
    data: updateData,
  });
}

/* ─────────────────────────────
   🗑 DELETE PSU
───────────────────────────── */
export async function deletePSU(id: string) {
  await requireAdminServer();

  return prisma.pSUCompany.delete({
    where: { id },
  });
}

/* ─────────────────────────────
   📄 LIST PSU
───────────────────────────── */
export async function listAdminPSUs() {
  await requireAdminServer();

  return prisma.pSUCompany.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      cutoffs: true,
    },
  });
}