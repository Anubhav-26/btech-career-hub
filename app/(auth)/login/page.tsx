import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/shared/AuthForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70dvh] items-center justify-center py-12">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
