import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";

const ROLE_REDIRECT: Record<string, string> = {
  superadmin: "/dashboard/superadmin",
  admin: "/dashboard/admin",
  boxer: "/dashboard/boxer",
  coach: "/dashboard/coach",
  academy: "/dashboard/academy",
  referee_judge: "/dashboard/referee-judge",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mba_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) redirect("/login");

  const dest = ROLE_REDIRECT[payload.role.toLowerCase()] ?? "/login";
  redirect(dest);
}
