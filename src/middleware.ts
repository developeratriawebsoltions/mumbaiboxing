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

  /*
   * REFEREE / JUDGE
   */
  referee_judge: [
  "/dashboard/referee-judge",
  "/dashboard/referee-judge/profile",
  "/dashboard/referee-judge/documents",
  "/dashboard/referee-judge/certificates",
  "/dashboard/referee-judge/tournaments",
  "/dashboard/referee-judge/payments",
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
   */
  admin: [
    "/dashboard/admin",
  ],

  /*
   * SUPER ADMIN
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
   * 1. Canonicalize old Referee/Judge URL
   *
   * If anything still tries to access:
   * /dashboard/referee_judge
   *
   * send it to:
   * /dashboard/referee-judge
   * ---------------------------------------------------------
   */

  if (
    pathname === "/dashboard/referee_judge" ||
    pathname.startsWith("/dashboard/referee_judge/")
  ) {
    const url = req.nextUrl.clone();

    url.pathname = pathname.replace(
      "/dashboard/referee_judge",
      "/dashboard/referee-judge"
    );

    return NextResponse.redirect(url);
  }

  /*
   * ---------------------------------------------------------
   * 2. Protected dashboard routes
   * ---------------------------------------------------------
   */

  if (PROTECTED.test(pathname) && !payload) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  /*
   * ---------------------------------------------------------
   * 3. Auth pages
   *
   * Already authenticated users should not remain on
   * the login/register pages.
   * ---------------------------------------------------------
   */

  if (AUTH_PAGES.includes(pathname) && payload) {
    const role = String(payload.role ?? "").toLowerCase();

    /*
     * SUPER ADMIN
     */
    if (role === "superadmin") {
      return NextResponse.redirect(
        new URL("/dashboard/superadmin", req.url)
      );
    }

    /*
     * ADMIN
     */
    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/admin", req.url)
      );
    }

    /*
     * REFEREE / JUDGE
     *
     * IMPORTANT:
     * Database role = referee_judge
     * URL = referee-judge
     */
    if (role === "referee_judge") {
      return NextResponse.redirect(
        new URL("/dashboard/referee-judge", req.url)
      );
    }

    /*
     * NORMAL MEMBERS
     */
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, req.url)
    );
  }

  /*
   * ---------------------------------------------------------
   * 4. Role-based dashboard access
   * ---------------------------------------------------------
   */

  if (PROTECTED.test(pathname) && payload) {
    const role = String(payload.role ?? "").toLowerCase();

    const allowed = ROLE_ALLOWED[role];

    /*
     * Unknown role = deny access.
     */
    if (!allowed) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    const hasAccess = allowed.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(route + "/")
    );

    /*
     * User is authenticated but does not have permission
     * for this dashboard route.
     */
    if (!hasAccess) {
      /*
       * SUPER ADMIN
       */
      if (role === "superadmin") {
        return NextResponse.redirect(
          new URL("/dashboard/superadmin", req.url)
        );
      }

      /*
       * ADMIN
       */
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/dashboard/admin", req.url)
        );
      }

      /*
       * REFEREE / JUDGE
       */
      if (role === "referee_judge") {
        return NextResponse.redirect(
          new URL("/dashboard/referee-judge", req.url)
        );
      }

      /*
       * NORMAL MEMBER
       */
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