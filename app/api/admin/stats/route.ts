import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalExams, totalResources, totalPyqs, totalVideos, weeklyActiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.exam.count({ where: { isActive: true } }),
      prisma.resource.count(),
      prisma.pYQ.count(),
      prisma.video.count(),
      prisma.userProgress.findMany({
        where: { lastViewedAt: { gte: weekAgo } },
        distinct: ["userId"],
        select: { userId: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        totalUsers,
        totalExams,
        totalResources,
        totalPyqs,
        totalVideos,
        weeklyActiveUsers: weeklyActiveUsers.length,
      },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
