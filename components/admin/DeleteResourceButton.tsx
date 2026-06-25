"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function DeleteResourceButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const { getIdToken } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this resource? This can't be undone.")) return;
    setPending(true);
    try {
      const token = await getIdToken();
      await fetch(`/api/resources/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={pending} aria-label="Delete resource">
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
