import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all resumes (admin view)
export async function GET() {
  try {
    const profiles = await prisma.placementProfile.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}