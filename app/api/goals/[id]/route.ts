import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { updateGoalSchema } from "@/lib/validations/phase1";
import { updateGoal, deleteGoal } from "@/services/phase1/goalService";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser(req);
    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = updateGoalSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }
    const goal = await updateGoal(user.id, id, parsed.data);
    if (!goal) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Goal not found" } }, { status: 404 });
    return NextResponse.json({ data: goal });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser(req);
    const { id } = await params;
    await deleteGoal(user.id, id);
    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    return authErrorResponse(err);
  }
}
