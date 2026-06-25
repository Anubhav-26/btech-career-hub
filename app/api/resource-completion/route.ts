import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { resourceCompletionSchema } from "@/lib/validations/phase1";
import { toggleResourceCompletion, getResourceCompletionStats } from "@/services/phase1/featureServices";

/** GET /api/resource-completion?examSlug=gate-cse — completion stats */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const examSlug = new URL(req.url).searchParams.get("examSlug") ?? undefined;
    const stats = await getResourceCompletionStats(user.id, examSlug);
    return NextResponse.json({ data: stats });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** POST /api/resource-completion — toggle completed/not */
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = resourceCompletionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }
    const result = await toggleResourceCompletion(user.id, parsed.data.resourceId);
    return NextResponse.json({ data: result });
  } catch (err) {
    return authErrorResponse(err);
  }
}
