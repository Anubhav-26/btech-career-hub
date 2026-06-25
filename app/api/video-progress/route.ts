import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { videoProgressSchema } from "@/lib/validations/phase1";
import { upsertVideoProgress, getVideoProgressStats, getContinueWatching } from "@/services/phase1/featureServices";

/** GET /api/video-progress — stats + continue watching */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const [stats, continueWatching] = await Promise.all([
      getVideoProgressStats(user.id),
      getContinueWatching(user.id, 5),
    ]);
    return NextResponse.json({ data: { ...stats, continueWatching } });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** POST /api/video-progress — upsert watch state */
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = videoProgressSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }
    const result = await upsertVideoProgress(user.id, parsed.data.videoId, parsed.data.watchedSecs, parsed.data.isCompleted);
    return NextResponse.json({ data: result });
  } catch (err) {
    return authErrorResponse(err);
  }
}
