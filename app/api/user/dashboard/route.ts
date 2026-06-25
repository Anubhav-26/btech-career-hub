import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth";
import { getDashboardPayload } from "@/services/dashboardService";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const data = await getDashboardPayload(user.id);
    return NextResponse.json({ data });
  } catch (error) {
    return authErrorResponse(error);
  }
}
