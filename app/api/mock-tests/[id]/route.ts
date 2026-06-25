import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { deleteMockTest } from "@/services/phase1/mockTestService";

interface Params { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser(req);
    const { id } = await params;
    await deleteMockTest(user.id, id);
    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    return authErrorResponse(err);
  }
}
