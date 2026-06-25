import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyIdToken } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ idToken: z.string().min(10) });

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Called by hooks/useAuth.tsx on every Firebase auth-state change.
 * 1. Verifies the ID token server-side (never trusts the client's claim).
 * 2. Upserts the Postgres User row, keyed by firebaseUid — this is the
 *    ONE place a User row gets created (see docs/01-architecture.md §1.4).
 * 3. Sets short-lived httpOnly cookies middleware.ts and getServerUser()
 *    read for the SSR/route-protection fast path. The cookie holds the
 *    raw ID token (~1h expiry); the client re-syncs on every token
 *    refresh, so staleness tops out around an hour, acceptable for an MVP.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "idToken required" } }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await verifyIdToken(parsed.data.idToken);
  } catch {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid ID token" } }, { status: 401 });
  }

  const email = decoded.email ?? "";
  const bootstrapRole = SUPER_ADMIN_EMAILS.includes(email.toLowerCase()) ? "ADMIN" : "STUDENT";

  const user = await prisma.user.upsert({
    where: { firebaseUid: decoded.uid },
    update: { email, name: decoded.name ?? undefined, avatarUrl: decoded.picture ?? undefined },
    create: {
      firebaseUid: decoded.uid,
      email,
      name: decoded.name ?? null,
      avatarUrl: decoded.picture ?? null,
      role: bootstrapRole,
    },
  });

  const res = NextResponse.json({ data: { onboarded: Boolean(user.onboardedAt), role: user.role } });
  const maxAge = 60 * 55; // slightly under Firebase's 1h ID token expiry
  res.cookies.set("bch_session", parsed.data.idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  res.cookies.set("bch_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}

/** Logout: clears both cookies. */
export async function DELETE() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.delete("bch_session");
  res.cookies.delete("bch_role");
  return res;
}
