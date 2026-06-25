import { NextRequest, NextResponse } from "next/server";
import { listCompanies } from "@/services/resourceService";
import { enforceRateLimit } from "@/lib/rate-limit";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { CompanyType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const companyType = (searchParams.get("companyType") as CompanyType | null) ?? undefined;
  const examSlug = searchParams.get("examSlug") ?? undefined;

  const companies = await listCompanies({ companyType, examSlug });
  return NextResponse.json({ data: companies });
}

const createCompanySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  logoUrl: z.string().url().optional(),
  companyType: z.enum(["PSU", "PLACEMENT"]),
  description: z.string().optional(),
  website: z.string().url().optional(),
  avgPackageLpa: z.number().positive().optional(),
  rolesHiredFor: z.array(z.string()).default([]),
  recruitsViaGate: z.boolean().optional(),
  examSlugs: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const json = await req.json().catch(() => null);
    const parsed = createCompanySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const { examSlugs, ...data } = parsed.data;
    const company = await prisma.company.create({
      data: {
        ...data,
        exams: examSlugs.length
          ? { create: await Promise.all(examSlugs.map(async (slug) => {
              const exam = await prisma.exam.findUniqueOrThrow({ where: { slug }, select: { id: true } });
              return { examId: exam.id };
            })) }
          : undefined,
      },
    });
    return NextResponse.json({ data: company }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
