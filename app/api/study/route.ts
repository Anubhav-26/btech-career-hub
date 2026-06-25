import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createStudyLogSchema } from "@/lib/validations/phase1";
import { getStudyHeatmapData, computeStreaks, getStudyStats, getRecentStudyLogs } from "@/services/phase1/studyService";
import { prisma } from "@/lib/prisma";

/** GET /api/study — returns heatmap, streaks, stats, and recent logs */
export async function GET(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "publicRead");
    if (limited) return limited;
    const user = await requireUser(req);

    const [heatmapData, stats, recent] = await Promise.all([
      getStudyHeatmapData(user.id, 365),
      getStudyStats(user.id),
      getRecentStudyLogs(user.id, 10),
    ]);

    const streaks = computeStreaks(heatmapData);

    return NextResponse.json({ data: { heatmap: heatmapData, ...streaks, ...stats, recentLogs: recent } });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** POST /api/study — log a study session */
export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "auth");
    if (limited) return limited;
    const user = await requireUser(req);

    const json = await req.json().catch(() => null);
    const parsed = createStudyLogSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } }, { status: 422 });
    }

    const log = await prisma.studyLog.create({
      data: {
        userId: user.id,
        date: new Date(parsed.data.date),
        topic: parsed.data.topic,
        subject: parsed.data.subject,
        minutes: parsed.data.minutes,
        notes: parsed.data.notes,
        examCategory: parsed.data.examCategory as never,
      },
    });
    return NextResponse.json({ data: log }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}

/** DELETE /api/study?id=xxx */
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "id required" } }, { status: 422 });

    await prisma.studyLog.deleteMany({ where: { id, userId: user.id } });
    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    return authErrorResponse(err);
  }
}
