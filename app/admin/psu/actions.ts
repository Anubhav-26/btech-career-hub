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
   🔐 BRANCH VALIDATION
───────────────────────────── */
function normalizeBranches(branches: string[] = []): Branch[] {
  return branches.map((b) => {
    const key = b.trim().toUpperCase();

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
  maxSalaryLpa?: number;
  minGateScore?: number;
  branches: string[];
  description?: string;
  selectionProcess?: string;
  officialUrl?: string;
  logoUrl?: string;
}) {
  await requireAdminServer();

  return prisma.pSUCompany.create({
    data: {
      name: data.name.trim(),
      slug: slugify(data.name),

      sector: data.sector,

      avgSalaryLpa: data.avgSalaryLpa ?? null,
      maxSalaryLpa: data.maxSalaryLpa ?? null,
      minGateScore: data.minGateScore ?? null,

      branches: normalizeBranches(data.branches),

      description: data.description ?? "",
      selectionProcess: data.selectionProcess ?? "",

      officialUrl: data.officialUrl ?? null,
      logoUrl: data.logoUrl ?? null,
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
    maxSalaryLpa: number;
    minGateScore: number;
    branches: string[];
    description: string;
    selectionProcess: string;
    officialUrl: string;
    logoUrl: string;
    isActive: boolean;
  }>
) {
  await requireAdminServer();

  const updateData: any = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
    updateData.slug = slugify(data.name);
  }

  if (data.sector !== undefined) updateData.sector = data.sector;
  if (data.avgSalaryLpa !== undefined) updateData.avgSalaryLpa = data.avgSalaryLpa;
  if (data.maxSalaryLpa !== undefined) updateData.maxSalaryLpa = data.maxSalaryLpa;
  if (data.minGateScore !== undefined) updateData.minGateScore = data.minGateScore;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.selectionProcess !== undefined) updateData.selectionProcess = data.selectionProcess;
  if (data.officialUrl !== undefined) updateData.officialUrl = data.officialUrl;
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

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
   📄 ADMIN LIST
───────────────────────────── */
export async function listAdminPSUs() {
  await requireAdminServer();

  return prisma.pSUCompany.findMany({
    include: {
      cutoffs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ─────────────────────────────
   🌐 PUBLIC LIST (FIXED + COMPLETE DATA)
───────────────────────────── */
export async function listPublicPSUs() {
  return prisma.pSUCompany.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sector: true,
      branches: true,
      minGateScore: true,
      avgSalaryLpa: true,
      maxSalaryLpa: true,
      description: true,
      selectionProcess: true,
      officialUrl: true,
      logoUrl: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

/* ─────────────────────────────
   🔍 GET PSU BY SLUG
───────────────────────────── */
export async function getPSUBySlug(slug: string) {
  return prisma.pSUCompany.findUnique({
    where: { slug },
    include: {
      cutoffs: {
        orderBy: {
          year: "desc",
        },
      },
    },
  });
}