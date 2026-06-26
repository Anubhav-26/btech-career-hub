import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function PATCH(req: Request) {
  try {
    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.placementApplication.update({
      where: { id: applicationId },
      include: {
        user: true,
        company: true,
      },
      data: { status },
    });

    // 📧 EMAIL SEND
    if (updated.user?.email) {
      await sendEmail({
        to: updated.user.email,
        subject: `Placement Update - ${updated.company?.name}`,
        text: `Hi ${updated.user.name},  
Your application status for ${updated.company?.name} is now: ${status}`,
      });
    }

    return NextResponse.json({
      message: "Status updated + email sent",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}