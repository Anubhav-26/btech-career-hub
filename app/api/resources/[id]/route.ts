import { NextRequest, NextResponse } from "next/server";
import { updateResourceSchema } from "@/lib/validations/resource";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

/* ==========================================================
   GET RESOURCE
========================================================== */

export async function GET(req: NextRequest, { params }: Params) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { id } = await params;

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        exam: {
          select: {
            slug: true,
            shortTitle: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: resource,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
        },
      },
      {
        status: 404,
      }
    );
  }
}

/* ==========================================================
   UPDATE RESOURCE
========================================================== */

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const { id } = await params;

    const json = await req.json().catch(() => null);

    const parsed = updateResourceSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message:
              parsed.error.issues[0]?.message ??
              "Invalid input",
          },
        },
        {
          status: 422,
        }
      );
    }

    const resource = await prisma.resource.update({
      where: {
        id,
      },
      data: parsed.data,
      include: {
        exam: {
          select: {
            slug: true,
            shortTitle: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: resource,
      message: "Resource updated successfully",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

/* ==========================================================
   DELETE RESOURCE
========================================================== */

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const { id } = await params;

    await prisma.resource.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      data: {
        ok: true,
      },
      message: "Resource deleted successfully",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}