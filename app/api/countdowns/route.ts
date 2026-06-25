import { NextRequest, NextResponse } from "next/server";
import { requireUser, requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createCountdownSchema } from "@/lib/validations/phase1";
import { getActiveCountdowns, getUserPinnedCountdowns } from "@/services/phase1/featureServices";
import { prisma } from "@/lib/prisma";

/** GET /api/countdowns?pinned=true — all active or just user's pinned */
export async function GET(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "publicRead");
    if (limited) return limited;

    const showPinned = new URL(req.url).searchParams.get("pinned") === "true";

    if (showPinned) {
      const user = await requireUser(req);
      const data = await getUserPinnedCountdowns(user.id);
      return NextResponse.json({ data });
    }

    const data = await getActiveCountdowns();
    return NextResponse.json({ data });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** POST /api/countdowns — admin creates a countdown */
export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const json = await req.json().catch(() => null);
    const parsed = createCountdownSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }

    const countdown = await prisma.examCountdown.create({
      data: { ...parsed.data, examDate: new Date(parsed.data.examDate), category: parsed.data.category as never },
    });
    return NextResponse.json({ data: countdown }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
