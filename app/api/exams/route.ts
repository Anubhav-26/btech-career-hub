import { NextRequest, NextResponse } from "next/server";
import { listExams } from "@/services/examService";
import { examQuerySchema, createExamSchema, metadataSchemaForCategory } from "@/lib/validations/exam";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const parsed = examQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid query params" } }, { status: 422 });
  }

  const exams = await listExams(parsed.data);
  return NextResponse.json({ data: exams });
}

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);
    const json = await req.json().catch(() => null);
    const parsed = createExamSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }
    // superRefine in createExamSchema already validated metadata against
    // metadataSchemaForCategory(category); re-parse here only to get the
    // typed/stripped object Prisma should persist.
    const metadata = metadataSchemaForCategory(parsed.data.category).parse(parsed.data.metadata);

    const exam = await prisma.exam.create({
      data: {
        ...parsed.data,
        metadata: metadata as Prisma.InputJsonValue,
        examDate: parsed.data.examDate ? new Date(parsed.data.examDate) : null,
        applicationDeadline: parsed.data.applicationDeadline ? new Date(parsed.data.applicationDeadline) : null,
      },
    });
    return NextResponse.json({ data: exam }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
