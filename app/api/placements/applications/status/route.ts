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
      data: { status },
      include: {
        user: true,
      },
    });

    // 📧 EMAIL SEND
    if (updated.user?.email) {
      await sendEmail({
        to: updated.user.email,
        subject: `Placement Update - ${updated.companyName}`,
        text: `Hi ${updated.user.name ?? "Student"},

Your application status for ${updated.companyName} is now: ${status}.

Best of luck!

BTech Career Hub`,
      });
    }

    return NextResponse.json({
      message: "Status updated + email sent",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}