"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@prisma/client";

export function UserRoleToggle({ userId, role }: { userId: string; role: Role }) {
  const [pending, setPending] = useState(false);
  const { getIdToken } = useAuth();
  const router = useRouter();

  async function toggleRole() {
    setPending(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: role === "ADMIN" ? "STUDENT" : "ADMIN" }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleRole} disabled={pending}>
      {role === "ADMIN" ? "Demote to student" : "Promote to admin"}
    </Button>
  );
}
