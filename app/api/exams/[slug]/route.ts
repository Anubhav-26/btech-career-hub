import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getExamBySlug } from "@/services/examService";
import { updateExamSchema } from "@/lib/validations/exam";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { slug } = await params;
  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isActive) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Exam not found" } }, { status: 404 });
  }
  return NextResponse.json({ data: exam });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const { slug } = await params;
    const json = await req.json().catch(() => null);
    const parsed = updateExamSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const { examDate, applicationDeadline, metadata, ...rest } = parsed.data;
    const exam = await prisma.exam.update({
      where: { slug },
      data: {
  ...rest,
  ...(metadata !== undefined && {
    metadata: metadata as Prisma.InputJsonValue,
  }),
  ...(examDate !== undefined && {
    examDate: examDate ? new Date(examDate) : null,
  }),
  ...(applicationDeadline !== undefined && {
    applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
  }),
},
    });

    // ISR cache for /exam/[slug] reflects the edit immediately, per
    // docs/05-api-endpoints.md §5.3, instead of waiting for the next
    // revalidate: 3600 window.
    revalidatePath(`/exam/${slug}`);

    return NextResponse.json({ data: exam });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const { slug } = await params;
    // Soft-delete to preserve FK integrity with existing UserProgress rows.
    await prisma.exam.update({ where: { slug }, data: { isActive: false } });
    revalidatePath(`/exam/${slug}`);

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
