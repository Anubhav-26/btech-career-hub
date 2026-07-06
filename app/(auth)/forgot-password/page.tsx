"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await resetPassword(email);

      setSuccess(
        "Password reset link has been sent to your email. Please check your inbox."
      );
      setEmail("");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;

        default:
          setError("Unable to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex min-h-[70dvh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-primary hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}