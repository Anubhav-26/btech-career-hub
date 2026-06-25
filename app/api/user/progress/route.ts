import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { progressUpdateSchema } from "@/lib/validations/onboarding";
import { recordProgress } from "@/services/progressService";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "progress");
    if (limited) return limited;

    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = progressUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const progress = await recordProgress(user.id, parsed.data.contentType, parsed.data.contentId, parsed.data.status);
    return NextResponse.json({ data: progress });
  } catch (error) {
    return authErrorResponse(error);
  }
}
