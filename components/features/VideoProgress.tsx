"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface VideoItem {
  updatedAt: string;
  watchedSecs: number;
  video: {
    id: string;
    title: string;
    youtubeId: string;
    exam: { slug: string; shortTitle: string };
  };
}

interface VideoProgressStats {
  completed: number;
  inProgress: number;
  continueWatching: VideoItem[];
}

function secToMin(s: number) {
  const m = Math.floor(s / 60);
  return m < 1 ? "<1 min" : `${m} min`;
}

export function VideoProgressWidget({ stats }: { stats: VideoProgressStats }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Video Progress</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-3">
          <div>
            <p className="stat-number text-lg font-semibold text-primary">{stats.completed}</p>
            <p className="text-xs text-ink-muted">Completed</p>
          </div>
          <div>
            <p className="stat-number text-lg font-semibold text-primary">{stats.inProgress}</p>
            <p className="text-xs text-ink-muted">In progress</p>
          </div>
        </div>

        {stats.continueWatching.length > 0 && (
          <>
            <p className="mb-2 text-xs font-medium text-ink-muted">Continue watching</p>
            <div className="space-y-2">
              {stats.continueWatching.map((item) => (
                <Link
                  key={item.video.id}
                  href={`/exam/${item.video.exam.slug}?tab=videos`}
                  className="flex items-center gap-2 rounded-lg border border-border p-2 hover:bg-muted"
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${item.video.youtubeId}/default.jpg`}
                    alt=""
                    width={64}
                    height={36}
                    className="h-9 w-16 shrink-0 rounded object-cover"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{item.video.title}</p>
                    <p className="text-[10px] text-ink-muted">{item.video.exam.shortTitle} · {secToMin(item.watchedSecs)} watched</p>
                  </div>
                  <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                </Link>
              ))}
            </div>
          </>
        )}

        {stats.continueWatching.length === 0 && stats.inProgress === 0 && stats.completed === 0 && (
          <p className="text-sm text-ink-muted">No video activity yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
