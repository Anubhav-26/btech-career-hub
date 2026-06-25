import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    return NextResponse.json({ data: user });
  } catch (error) {
    return authErrorResponse(error);
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json().catch(() => null);
    const parsed = updateProfileSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
        { status: 422 }
      );
    }
    const updated = await prisma.user.update({ where: { id: user.id }, data: parsed.data });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return authErrorResponse(error);
  }
}
