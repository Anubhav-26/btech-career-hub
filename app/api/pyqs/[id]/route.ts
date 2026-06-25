import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createPyqSchema } from "@/lib/validations/resource";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = createPyqSchema.partial().safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const pyq = await prisma.pYQ.update({
      where: { id },
      data: { ...parsed.data, hasSolution: parsed.data.solutionUrl ? true : undefined },
    });
    return NextResponse.json({ data: pyq });
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
    await prisma.pYQ.delete({ where: { id } });
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
