"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/firebase/client";

export function ProfileActions() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-6 flex gap-3">
      <Button asChild variant="outline" size="sm">
        <Link href="/onboarding">Edit preferences</Link>
      </Button>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
