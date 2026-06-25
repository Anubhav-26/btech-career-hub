import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const items = await prisma.savedItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        exam: { select: { slug: true, title: true } },
        resource: { select: { id: true, title: true } },
        pyq: { select: { id: true, year: true, exam: { select: { slug: true, shortTitle: true } } } },
      },
    });
    return NextResponse.json({ data: items });
  } catch (error) {
    return authErrorResponse(error);
  }
}

const toggleSchema = z
  .object({
    examId: z.string().cuid().optional(),
    resourceId: z.string().cuid().optional(),
    pyqId: z.string().cuid().optional(),
  })
  .refine((d) => [d.examId, d.resourceId, d.pyqId].filter(Boolean).length === 1, {
    message: "Provide exactly one of examId, resourceId, or pyqId",
  });

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = toggleSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const existing = await prisma.savedItem.findFirst({ where: { userId: user.id, ...parsed.data } });
    if (existing) {
      await prisma.savedItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { saved: false } });
    }

    await prisma.savedItem.create({ data: { userId: user.id, ...parsed.data } });
    return NextResponse.json({ data: { saved: true } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
