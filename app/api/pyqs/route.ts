import { NextRequest, NextResponse } from "next/server";
import { listPyqs } from "@/services/resourceService";
import { createPyqSchema } from "@/lib/validations/resource";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const examSlug = searchParams.get("examSlug") ?? undefined;
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
  const subject = searchParams.get("subject") ?? undefined;

  const pyqs = await listPyqs({ examSlug, year, subject });
  return NextResponse.json({ data: pyqs });
}

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const json = await req.json().catch(() => null);
    const parsed = createPyqSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const pyq = await prisma.pYQ.create({ data: { ...parsed.data, hasSolution: Boolean(parsed.data.solutionUrl) } });
    return NextResponse.json({ data: pyq }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
