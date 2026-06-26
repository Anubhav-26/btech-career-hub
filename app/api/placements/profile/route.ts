import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET: Fetch placement profile by userId
 * URL: /api/placements/profile?userId=xyz
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.placementProfile.findUnique({
      where: { userId },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch placement profile" },
      { status: 500 }
    );
  }
}

/**
 * POST: Create or update placement profile
 * Body: { userId, resumeUrl, skills, cgpa, branch }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, resumeUrl, skills, cgpa, branch } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.placementProfile.upsert({
      where: { userId },
      update: {
        resumeUrl,
        skills,
        cgpa,
        branch,
      },
      create: {
        userId,
        resumeUrl,
        skills,
        cgpa,
        branch,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save placement profile" },
      { status: 500 }
    );
  }
}