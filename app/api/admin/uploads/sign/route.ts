import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { signUpload } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(req, "adminWrite");
    if (limited) return limited;
    await requireAdmin(req);

    const data = signUpload();
    return NextResponse.json({ data });
  } catch (error) {
    return authErrorResponse(error);
  }
}
