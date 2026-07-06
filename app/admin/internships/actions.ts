"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface InternshipInput {
  title: string;
  company: string;
  location?: string;
  workMode: "ONSITE" | "REMOTE" | "HYBRID";
  stipendMin?: number;
  stipendMax?: number;
  duration?: string;
  applyLink: string;
  source: string;
  deadline?: Date;
  branches: string[];
}

/* =========================
   CREATE
========================= */

export async function createInternship(data: InternshipInput) {
  await prisma.internship.create({
    data: {
      title: data.title,
      company: data.company,
      location: data.location,
      workMode: data.workMode,
      stipendMin: data.stipendMin,
      stipendMax: data.stipendMax,
      duration: data.duration,
      applyLink: data.applyLink,
      source: data.source,
      deadline: data.deadline,
      branches: data.branches as any,
    },
  });

  revalidatePath("/admin/internship");
}

/* =========================
   LIST
========================= */

export async function listAdminInternships() {
  return prisma.internship.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* =========================
   UPDATE
========================= */

export async function updateInternship(
  id: string,
  data: Partial<InternshipInput>
) {
  await prisma.internship.update({
    where: {
      id,
    },
    data: {
      ...data,
      branches: data.branches as any,
    },
  });

  revalidatePath("/admin/internship");
}

/* =========================
   DELETE
========================= */

export async function deleteInternship(id: string) {
  await prisma.internship.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/internship");
}