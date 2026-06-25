import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createMockTestSchema } from "@/lib/validations/phase1";
import { getMockTestAnalytics, createMockTest } from "@/services/phase1/mockTestService";

/** GET /api/mock-tests?examCategory=GATE — analytics payload for Recharts */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const category = new URL(req.url).searchParams.get("examCategory") ?? undefined;
    const analytics = await getMockTestAnalytics(user.id, category);
    return NextResponse.json({ data: analytics });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** POST /api/mock-tests — record a new test */
export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "auth");
    if (limited) return limited;
    const user = await requireUser(req);

    const json = await req.json().catch(() => null);
    const parsed = createMockTestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }

    const test = await createMockTest(user.id, parsed.data);
    return NextResponse.json({ data: test }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
