import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const role = searchParams.get("role") || undefined;

    const pageRaw = Number(searchParams.get("page"));
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const pageSizeRaw = Number(searchParams.get("pageSize"));
    const pageSize =
      Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
        ? Math.min(pageSizeRaw, 50)
        : 25;

    const where: any = {
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          branch: true,
          year: true,
          goals: true,
          createdAt: true,
        },
      }),

      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}