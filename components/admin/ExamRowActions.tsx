"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ExamRowActions({ slug, isActive }: { slug: string; isActive: boolean }) {
  const [pending, setPending] = useState(false);
  const { getIdToken } = useAuth();
  const router = useRouter();

  async function toggleActive() {
    setPending(true);
    try {
      const token = await getIdToken();
      await fetch(`/api/exams/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleActive} disabled={pending}>
      {isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
