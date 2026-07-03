"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
 DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Video {
  id: string;
  title: string;
  youtubeId: string | null;
  playlistId: string | null;
  channel: string;
  subject: string | null;
}

interface Props {
  video: Video;
}

export function EditVideoModal({ video }: Props) {
  const router = useRouter();
  const { getIdToken } = useAuth();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(video.title);

  const [youtubeInput, setYoutubeInput] = useState(
    video.youtubeId ?? video.playlistId ?? ""
  );

  const [channel, setChannel] = useState(video.channel);

  const [subject, setSubject] = useState(video.subject ?? "");

  const [loading, setLoading] = useState(false);

  async function saveChanges() {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    if (!youtubeInput.trim()) {
      alert("YouTube URL / Playlist URL is required.");
      return;
    }

    if (!channel.trim()) {
      alert("Channel name is required.");
      return;
    }

    try {
      setLoading(true);

      const token = await getIdToken();

      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          youtubeId: youtubeInput,
          channel,
          subject: subject || undefined,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          json?.error?.message ??
            "Failed to update video."
        );
      }

      alert("✅ Video updated successfully.");

      setOpen(false);

      router.refresh();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
      >
        ✏️
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video Title"
            />

            <Input
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="YouTube URL / Playlist URL / Video ID"
            />

            <Input
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="Channel Name"
            />

            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (Optional)"
            />

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={saveChanges}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}