import { NextRequest, NextResponse } from "next/server";
import { listResources } from "@/services/resourceService";
import {
  resourceQuerySchema,
  createResourceSchema,
} from "@/lib/validations/resource";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);

  const parsed = resourceQuerySchema.safeParse(
    Object.fromEntries(searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query params",
        },
      },
      { status: 422 }
    );
  }

  const result = await listResources(parsed.data);

  return NextResponse.json({
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const json = await req.json().catch(() => null);

    const parsed = createResourceSchema.safeParse(json);

    if (!parsed.success) {
      console.log("=================================");
      console.log("RESOURCE VALIDATION ERROR");
      console.log(parsed.error.format());
      console.log("REQUEST BODY:");
      console.log(json);
      console.log("=================================");

      return NextResponse.json(
        {
          error: parsed.error.format(),
        },
        { status: 422 }
      );
    }

    const resource = await prisma.resource.create({
      data: parsed.data,
    });

    return NextResponse.json(
      {
        data: resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RESOURCE CREATE ERROR:", error);
    return authErrorResponse(error);
  }
}