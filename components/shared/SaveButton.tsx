"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function SaveButton({
  target,
  initiallySaved = false,
}: {
  target: { examId?: string; resourceId?: string; pyqId?: string };
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, setPending] = useState(false);
  const { firebaseUser, getIdToken } = useAuth();
  const router = useRouter();

  async function toggle() {
    if (!firebaseUser) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setPending(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/user/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(target),
      });
      const json = await res.json();
      setSaved(Boolean(json.data?.saved));
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} disabled={pending}>
      {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
