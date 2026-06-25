import { NextRequest, NextResponse } from "next/server";
import { listVideos } from "@/services/resourceService";
import { createVideoSchema } from "@/lib/validations/resource";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const examSlug = searchParams.get("examSlug") ?? undefined;
  const subject = searchParams.get("subject") ?? undefined;

  const videos = await listVideos({ examSlug, subject });
  return NextResponse.json({ data: videos });
}

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const json = await req.json().catch(() => null);
    const parsed = createVideoSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }

    const video = await prisma.video.create({
      data: { ...parsed.data, thumbnailUrl: `https://i.ytimg.com/vi/${parsed.data.youtubeId}/hqdefault.jpg` },
    });
    return NextResponse.json({ data: video }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
