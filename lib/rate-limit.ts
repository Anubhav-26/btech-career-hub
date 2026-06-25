import { NextRequest } from "next/server";

/**
 * TEMPORARY: Rate limiting disabled for local development.
 * Restore Upstash implementation before production.
 */

export type LimiterName =
  | "search"
  | "progress"
  | "adminWrite"
  | "auth"
  | "publicRead";

export async function enforceRateLimit(
  req: NextRequest,
  name: LimiterName,
  identifier?: string
) {
  return null;
}