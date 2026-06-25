import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Resolves the Postgres User row for the request's Firebase ID token.
 * This is the single chokepoint every authenticated API route calls
 * through — see docs/01-architecture.md §1.4 for why Postgres (not the
 * Firebase token) is the source of truth for role/onboarding state.
 */
export async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new AuthError("Missing Authorization header");

  let decoded;
  try {
    decoded = await verifyIdToken(token);
  } catch {
    throw new AuthError("Invalid or expired token");
  }

  const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!user) {
    // Token is valid but no app-side row exists yet — the client should
    // call /api/user/onboarding (which upserts) before hitting protected
    // routes that assume an existing profile.
    throw new AuthError("User profile not found, complete onboarding first", 404);
  }
  return user;
}

/** Same as requireUser, but additionally enforces role === ADMIN. */
export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);
  if (user.role !== "ADMIN") {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

/**
 * Server Component equivalent of requireUser — reads the `bch_session`
 * httpOnly cookie (an ID token, synced by hooks/useAuth.tsx on every
 * client-side auth-state change) instead of an Authorization header,
 * since Server Components can't read headers the client set on a fetch
 * call that never happened. Returns null instead of throwing so pages
 * can redirect with next/navigation's redirect() rather than crash.
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bch_session")?.value;
  if (!token) return null;

  try {
    const decoded = await verifyIdToken(token);
    return await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  } catch {
    return null;
  }
}

/** Wraps a route handler body, converting AuthError into a clean JSON response. */
export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      { error: { code: "UNAUTHORIZED", message: error.message } },
      { status: error.status }
    );
  }
  console.error(error);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
    { status: 500 }
  );
}
