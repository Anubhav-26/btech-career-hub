import { NextRequest, NextResponse } from "next/server";
import { listVideos } from "@/services/resourceService";
import { createVideoSchema } from "@/lib/validations/resource";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

/* -----------------------------------------
   Parse Video URL / Playlist URL / IDs
------------------------------------------ */
function parseYoutubeInput(input: string) {
  const value = input.trim();

  // Direct Video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return {
      videoType: "VIDEO" as const,
      youtubeId: value,
      thumbnailUrl: `https://i.ytimg.com/vi/${value}/hqdefault.jpg`,
    };
  }

  // Direct Playlist ID
  if (/^(PL|UU|LL|RD|OL)[A-Za-z0-9_-]+$/.test(value)) {
    return {
      videoType: "PLAYLIST" as const,
      youtubeId: value,
      thumbnailUrl: null,
    };
  }

  try {
    const url = new URL(value);

    // youtu.be/VIDEO_ID
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");

      return {
        videoType: "VIDEO" as const,
        youtubeId: id,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }

    // youtube.com/watch?v=VIDEO_ID
    const videoId = url.searchParams.get("v");

    if (videoId) {
      return {
        videoType: "VIDEO" as const,
        youtubeId: videoId,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    // youtube.com/playlist?list=PLAYLIST_ID
    const playlistId = url.searchParams.get("list");

    if (playlistId) {
      return {
        videoType: "PLAYLIST" as const,
        youtubeId: playlistId,
        thumbnailUrl: null,
      };
    }
  } catch {}

  throw new Error("Invalid YouTube URL or ID");
}

/* -----------------------------------------
   GET
------------------------------------------ */

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "publicRead");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);

  const examSlug = searchParams.get("examSlug") ?? undefined;
  const subject = searchParams.get("subject") ?? undefined;

  const videos = await listVideos({
    examSlug,
    subject,
  });

  return NextResponse.json({
    data: videos,
  });
}

/* -----------------------------------------
   POST
------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;

    await requireAdmin(req);

    const json = await req.json().catch(() => null);

    const parsed = createVideoSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message:
              parsed.error.issues[0]?.message ?? "Invalid input",
          },
        },
        {
          status: 422,
        }
      );
    }

    const data = parsed.data;

    let youtubeId = "";
    let playlistId: string | null = null;
    let thumbnailUrl: string | null = null;

   const parsedYoutube = parseYoutubeInput(
  data.videoType === "VIDEO"
    ? data.youtubeId!
    : data.playlistId!
);

if (parsedYoutube.videoType === "VIDEO") {
  youtubeId = parsedYoutube.youtubeId;
  playlistId = null;
  thumbnailUrl = parsedYoutube.thumbnailUrl;
} else {
  youtubeId = "";
  playlistId = parsedYoutube.youtubeId;
  thumbnailUrl = null;
}

    const video = await prisma.video.create({
      data: {
        examId: data.examId,
        title: data.title,
        videoType: parsedYoutube.videoType,
        youtubeId,
        playlistId,
        channel: data.channel,
        subject: data.subject,
        durationSeconds: data.durationSeconds,
        thumbnailUrl,
      },
    });

    return NextResponse.json(
      {
        data: video,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return authErrorResponse(error);
  }
}