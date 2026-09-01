import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED = /^\/dashboard(\/|$)/;
const AUTH_PAGES = ["/login", "/register", "/admin/login"];

// Routes each role is allowed to access
const ROLE_ALLOWED: Record<string, string[]> = {
  boxer:       ["/dashboard/boxer", "/dashboard/medical", "/dashboard/certificates", "/dashboard/tournament", "/dashboard/ranking", "/dashboard/payment"],
  coach:       ["/dashboard/coach", "/dashboard/certificates", "/dashboard/tournament", "/dashboard/ranking", "/dashboard/payment"],
  academy:     ["/dashboard/academy", "/dashboard/boxer", "/dashboard/coach", "/dashboard/tournament", "/dashboard/payment", "/dashboard/documents"],
  association: ["/dashboard/association", "/dashboard/boxer", "/dashboard/coach", "/dashboard/academy", "/dashboard/tournament", "/dashboard/ranking", "/dashboard/payment", "/dashboard/documents", "/dashboard/reports"],
  school:      ["/dashboard/school", "/dashboard/boxer", "/dashboard/tournament", "/dashboard/certificates", "/dashboard/documents"],
  taluka:      ["/dashboard/taluka", "/dashboard/boxer", "/dashboard/coach", "/dashboard/school", "/dashboard/tournament", "/dashboard/ranking"],
  superadmin:  ["/dashboard/admin", "/dashboard/superadmin", "/dashboard/boxer", "/dashboard/coach", "/dashboard/academy", "/dashboard/tournament", "/dashboard/ranking", "/dashboard/payment", "/dashboard/medical", "/dashboard/certificates", "/dashboard/documents", "/dashboard/reports", "/dashboard/association", "/dashboard/school", "/dashboard/taluka"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("mba_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED.test(pathname) && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect already-logged-in users away from login/register
  if (AUTH_PAGES.includes(pathname) && payload) {
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, req.url));
  }

  // Role-based access check
  if (PROTECTED.test(pathname) && payload) {
    const role = payload.role.toLowerCase();
    const allowed = ROLE_ALLOWED[role];

    // superadmin can access everything
    if (allowed && allowed.length > 0) {
      const hasAccess = allowed.some((route) => pathname === route || pathname.startsWith(route + "/"));
      if (!hasAccess) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/admin/login"],
};
