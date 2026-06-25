import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  avgPackageLpa: z.number().positive().optional(),
  rolesHiredFor: z.array(z.string()).optional(),
  recruitsViaGate: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = updateCompanySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const company = await prisma.company.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ data: company });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const { id } = await params;
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
