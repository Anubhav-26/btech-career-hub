import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    // 1. Validation
    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status required" },
        { status: 400 }
      );
    }

    // 2. Update application
    const application = await prisma.placementApplication.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      },
    });

    // 3. Extra safety check
    if (!application.userId || !application.companyName) {
      return NextResponse.json(
        { error: "Invalid application data" },
        { status: 400 }
      );
    }

    const companyName = application.companyName;

    // 4. Notification message
    const messageMap: Record<string, string> = {
      SHORTLISTED: `🎉 You are shortlisted for ${companyName}`,
      SELECTED: `🚀 Congratulations! You are selected in ${companyName}`,
      REJECTED: `❌ Your application was not selected in ${companyName}`,
      APPLIED: `📢 Your application is submitted for ${companyName}`,
    };

    const notificationBody =
      messageMap[status] ??
      `📢 Status updated for ${companyName}`;

    // 5. Create notification
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: "Placement Update",
        body: notificationBody,
        type: "SYSTEM",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status updated + notification sent",
      application,
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error while updating status" },
      { status: 500 }
    );
  }
}