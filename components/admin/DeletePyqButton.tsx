"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function DeletePyqButton({
  id,
}: {
  id: string;
}) {
  const { getIdToken } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm(
      "Delete this PYQ permanently?"
    );

    if (!ok) return;

    const token = await getIdToken();

    const res = await fetch(`/api/pyqs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete PYQ");
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}