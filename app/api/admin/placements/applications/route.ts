import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==============================
// GET ALL APPLICATIONS (ADMIN)
// ==============================
export async function GET() {
  try {
    const applications = await prisma.placementApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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
// UPDATE APPLICATION STATUS
// ==============================
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.placementApplication.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}