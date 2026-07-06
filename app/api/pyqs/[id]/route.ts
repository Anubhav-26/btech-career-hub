import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createPyqSchema } from "@/lib/validations/resource";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

/* =========================
   UPDATE PYQ
========================= */

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const { id } = await params;

    const json = await req.json().catch(() => null);

    const parsed = createPyqSchema.partial().safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message:
              parsed.error.issues[0]?.message ?? "Invalid input",
          },
        },
        {
          status: 422,
        }
      );
    }

    const pyq = await prisma.pYQ.update({
      where: {
        id,
      },
      data: {
        ...parsed.data,
        hasSolution:
          parsed.data.solutionUrl !== undefined
            ? !!parsed.data.solutionUrl
            : undefined,
      },
    });

    return NextResponse.json({
      data: pyq,
    });
  } catch (error) {
    console.error(error);
    return authErrorResponse(error);
  }
}

/* =========================
   DELETE PYQ
========================= */

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const { id } = await params;

    await prisma.pYQ.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return authErrorResponse(error);
  }
}