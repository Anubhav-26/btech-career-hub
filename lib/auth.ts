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

// ─────────────────────────────────────────────
// 🔐 API ROUTE AUTH (NextRequest based)
// ─────────────────────────────────────────────

export async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) throw new AuthError("Missing Authorization header");

  let decoded;

  try {
    decoded = await verifyIdToken(token);
  } catch {
    throw new AuthError("Invalid or expired token");
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
  });

  if (!user) {
    throw new AuthError(
      "User profile not found, complete onboarding first",
      404
    );
  }

  return user;
}

// ─────────────────────────────────────────────
// 🛡️ ADMIN GUARD (API ROUTES ONLY)
// ─────────────────────────────────────────────

export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);

  if (user.role !== "ADMIN") {
    throw new AuthError("Admin access required", 403);
  }

  return user;
}

// ─────────────────────────────────────────────
// ⚡ SERVER ACTION AUTH (NO REQUEST OBJECT)
// ─────────────────────────────────────────────

export async function requireAdminServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bch_session")?.value;

  if (!token) {
    throw new AuthError("Unauthorized", 401);
  }

  let decoded;

  try {
    decoded = await verifyIdToken(token);
  } catch {
    throw new AuthError("Invalid session", 401);
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
  });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  if (user.role !== "ADMIN") {
    throw new AuthError("Admin access required", 403);
  }

  return user;
}

// ─────────────────────────────────────────────
// 👤 SERVER COMPONENT AUTH (SAFE READ ONLY)
// ─────────────────────────────────────────────

export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bch_session")?.value;

  if (!token) return null;

  try {
    const decoded = await verifyIdToken(token);

    return await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// ⚠️ API ERROR HANDLER
// ─────────────────────────────────────────────

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: error.message,
        },
      },
      { status: error.status }
    );
  }

  console.error(error);

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
      },
    },
    { status: 500 }
  );
}