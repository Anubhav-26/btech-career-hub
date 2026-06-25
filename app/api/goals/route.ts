import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createGoalSchema } from "@/lib/validations/phase1";
import { getUserGoals, createGoal } from "@/services/phase1/goalService";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const goals = await getUserGoals(user.id);
    return NextResponse.json({ data: goals });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "auth");
    if (limited) return limited;
    const user = await requireUser(req);

    const json = await req.json().catch(() => null);
    const parsed = createGoalSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }

    const goal = await createGoal(user.id, parsed.data);
    return NextResponse.json({ data: goal }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
