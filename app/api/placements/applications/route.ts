import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==============================
// GET ALL APPLICATIONS OF A USER
// ==============================
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
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// ==============================
// APPLY TO A COMPANY
// ==============================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      companyName,
      companySlug,
      role,
    } = body;

    if (!userId || !companyName || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Duplicate check
    const existing = await prisma.placementApplication.findFirst({
      where: {
        userId,
        companyName,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied" },
        { status: 400 }
      );
    }

    const application = await prisma.placementApplication.create({
      data: {
        userId,
        companyName,
        companySlug,
        role,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to apply" },
      { status: 500 }
    );
  }
}