import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { togglePinnedCountdown } from "@/services/phase1/featureServices";

interface Params { params: Promise<{ id: string }> }

/** POST /api/countdowns/[id] — toggle pin/unpin for the current user */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser(req);
    const { id } = await params;
    const result = await togglePinnedCountdown(user.id, id);
    return NextResponse.json({ data: result });
  } catch (err) {
    return authErrorResponse(err);
  }
}
