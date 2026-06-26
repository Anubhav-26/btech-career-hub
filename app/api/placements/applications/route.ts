import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all applications
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    const applications = await prisma.placementApplication.findMany({
      where: { userId },
      include: {
        company: true,
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST apply
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, companyId, role } = body;

    if (!userId || !companyId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔥 STEP YOU ASKED (DUPLICATE CHECK)
    const existing = await prisma.placementApplication.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied" },
        { status: 400 }
      );
    }

    // CREATE APPLICATION
    const application = await prisma.placementApplication.create({
      data: {
        userId,
        companyId,
        role,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to apply" },
      { status: 500 }
    );
  }
}