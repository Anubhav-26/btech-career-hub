"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function DeleteVideoButton({
  id,
}: {
  id: string;
}) {
  const { getIdToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this video?")) return;

    setLoading(true);

    try {
      const token = await getIdToken();

      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to delete video.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      disabled={loading}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}