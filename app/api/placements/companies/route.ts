import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      where: {
        companyType: "PLACEMENT",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// CREATE company (admin use)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      website,
      avgPackageLpa,
      rolesHiredFor,
      logoUrl,
    } = body;

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        description,
        website,
        avgPackageLpa,
        rolesHiredFor,
        logoUrl,
        companyType: "PLACEMENT",
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}