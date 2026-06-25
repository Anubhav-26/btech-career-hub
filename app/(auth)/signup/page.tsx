import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/shared/AuthForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="container flex min-h-[70dvh] items-center justify-center py-12">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
