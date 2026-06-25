import { NextRequest, NextResponse } from "next/server";

/**
 * Fast-path route protection only — presence/role of the httpOnly cookie
 * set by /api/auth/session, NOT a re-verification of the token signature
 * (that happens in lib/auth.ts on every actual data request). This keeps
 * middleware cheap (no Admin SDK call, which needs the Node runtime) while
 * still stopping a logged-out browser from ever rendering a protected page.
 * See docs/05-api-endpoints.md §5.3 "defense in depth."
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("bch_session")?.value;
  const role = req.cookies.get("bch_role")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = ["/dashboard", "/onboarding", "/profile"].some((p) => pathname.startsWith(p));

  if (!session && (isAdminRoute || isStudentRoute)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/profile/:path*", "/admin/:path*"],
};
