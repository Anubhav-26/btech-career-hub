import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "auth");
    if (limited) return limited;

    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = onboardingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { ...parsed.data, onboardedAt: new Date() },
    });

    return NextResponse.json({ data: { branch: updated.branch, year: updated.year, goals: updated.goals } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
