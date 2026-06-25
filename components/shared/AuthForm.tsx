"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/firebase/client";

const FRIENDLY_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists with this email — try logging in instead.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/weak-password": "Use at least 6 characters for your password.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/popup-closed-by-user": "Google sign-in was closed before completing.",
};

function friendlyError(err: unknown): string {
  if (err instanceof FirebaseError) {
    return FRIENDLY_ERRORS[err.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  async function afterAuth() {
    router.push(next);
    router.refresh();
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("email");
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      await afterAuth();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    try {
      await signInWithGoogle();
      await afterAuth();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {mode === "login" ? "Pick up your GATE/CAT/PSU prep where you left off." : "Free — takes about a minute."}
      </p>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mt-6 w-full"
        onClick={handleGoogle}
        disabled={loading !== null}
      >
        {loading === "google" ? "Connecting…" : "Continue with Google"}
      </Button>

      <div className="my-4 flex items-center gap-3 text-xs text-ink-muted">
        <div className="h-px flex-1 bg-border" />
        OR
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="you@college.edu"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading !== null}>
          {loading === "email" ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
