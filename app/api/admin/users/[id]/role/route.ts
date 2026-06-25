import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

const roleSchema = z.object({ role: z.enum(["STUDENT", "ADMIN"]) });

/**
 * Any existing ADMIN can promote/demote other users — the first admin
 * role is bootstrapped exclusively via SUPER_ADMIN_EMAILS at sign-in
 * (see app/api/auth/session/route.ts), so this route can never be the
 * entry point for self-granting admin from a freshly-created account.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await params;

    const json = await req.json().catch(() => null);
    const parsed = roleSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "role must be STUDENT or ADMIN" } }, { status: 422 });
    }

    if (id === admin.id && parsed.data.role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "You can't demote your own account" } },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({ where: { id }, data: { role: parsed.data.role } });
    return NextResponse.json({ data: { id: user.id, role: user.role } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
