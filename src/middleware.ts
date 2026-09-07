import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED = /^\/dashboard(\/|$)/;

const AUTH_PAGES = [
  "/login",
  "/register",
  "/admin/login",
  "/login/admin",
  "/login/superadmin",
];

const ROLE_ALLOWED: Record<string, string[]> = {
  boxer: [
    "/dashboard/boxer",
    "/dashboard/medical",
    "/dashboard/certificates",
    "/dashboard/tournament",
    "/dashboard/ranking",
    "/dashboard/payment",
  ],

  coach: [
    "/dashboard/coach",
    "/dashboard/certificates",
    "/dashboard/tournament",
    "/dashboard/ranking",
    "/dashboard/payment",
    "/dashboard/coach/boxers",
  ],

  academy: [
    "/dashboard/academy",
    "/dashboard/boxer",
    "/dashboard/coach",
    "/dashboard/tournament",
    "/dashboard/payment",
    "/dashboard/documents",
  ],

  association: [
    "/dashboard/association",
    "/dashboard/boxer",
    "/dashboard/coach",
    "/dashboard/academy",
    "/dashboard/tournament",
    "/dashboard/ranking",
    "/dashboard/payment",
    "/dashboard/documents",
    "/dashboard/reports",
  ],

  school: [
    "/dashboard/school",
    "/dashboard/boxer",
    "/dashboard/tournament",
    "/dashboard/certificates",
    "/dashboard/documents",
  ],

  taluka: [
    "/dashboard/taluka",
    "/dashboard/boxer",
    "/dashboard/coach",
    "/dashboard/school",
    "/dashboard/tournament",
    "/dashboard/ranking",
  ],

  /*
   * ADMIN
   *
   * Admin is intentionally separate from Super Admin.
   */
  admin: [
    "/dashboard/admin",
  ],

  /*
   * SUPER ADMIN
   *
   * Super Admin has access to the complete administration area.
   */
  superadmin: [
    "/dashboard/admin",
    "/dashboard/superadmin",
    "/dashboard/boxer",
    "/dashboard/coach",
    "/dashboard/academy",
    "/dashboard/tournament",
    "/dashboard/ranking",
    "/dashboard/payment",
    "/dashboard/medical",
    "/dashboard/certificates",
    "/dashboard/documents",
    "/dashboard/reports",
    "/dashboard/association",
    "/dashboard/school",
    "/dashboard/taluka",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("mba_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  /*
   * ---------------------------------------------------------
   * 1. Protected dashboard routes
   * ---------------------------------------------------------
   */

  if (PROTECTED.test(pathname) && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /*
   * ---------------------------------------------------------
   * 2. Auth pages
   *
   * Don't send an already authenticated user to the
   * normal member login page.
   * ---------------------------------------------------------
   */

  if (AUTH_PAGES.includes(pathname) && payload) {
    const role = payload.role.toLowerCase();

    if (role === "superadmin") {
      return NextResponse.redirect(
        new URL("/dashboard/superadmin", req.url)
      );
    }

    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/admin", req.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, req.url)
    );
  }

  /*
   * ---------------------------------------------------------
   * 3. Role-based dashboard access
   * ---------------------------------------------------------
   */

  if (PROTECTED.test(pathname) && payload) {
    const role = payload.role.toLowerCase();
    const allowed = ROLE_ALLOWED[role];

    /*
     * Unknown role = deny access.
     */
    if (!allowed) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const hasAccess = allowed.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(route + "/")
    );

    if (!hasAccess) {
      if (role === "superadmin") {
        return NextResponse.redirect(
          new URL("/dashboard/superadmin", req.url)
        );
      }

      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/dashboard/admin", req.url)
        );
      }

      return NextResponse.redirect(
        new URL(`/dashboard/${role}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
  "/dashboard/:path*",
  "/login",
  "/login/admin",
  "/login/superadmin",
  "/register",
  "/admin/login",
],
};