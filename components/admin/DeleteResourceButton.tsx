"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function DeleteResourceButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  const { getIdToken } = useAuth();

  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const ok = window.confirm(
      "Are you sure you want to delete this resource?\n\nThis action cannot be undone."
    );

    if (!ok) return;

    try {
      setPending(true);

      const token = await getIdToken();

      const res = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);

        throw new Error(
          json?.error?.message ??
            "Failed to delete resource."
        );
      }

      alert("✅ Resource deleted successfully.");

      router.refresh();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      disabled={pending}
      onClick={handleDelete}
      aria-label="Delete Resource"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}