import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET notifications
export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
}

// MARK AS READ
export async function PATCH(req: Request) {
  const body = await req.json();

  const updated = await prisma.notification.update({
    where: { id: body.id },
    data: { isRead: true },
  });

  return NextResponse.json(updated);
}