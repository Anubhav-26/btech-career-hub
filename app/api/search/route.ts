import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/services/searchService";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, "search");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? "8") || 8, 20);

  if (q.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const results = await globalSearch(q, limit);
  return NextResponse.json({ data: results });
}
