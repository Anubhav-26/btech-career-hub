import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { authErrorResponse } from "@/lib/auth";
import { getLeaderboard } from "@/services/phase1/featureServices";

export async function GET(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "publicRead");
    if (limited) return limited;
    const data = await getLeaderboard(10);
    return NextResponse.json({ data });
  } catch (err) {
    return authErrorResponse(err);
  }
}
