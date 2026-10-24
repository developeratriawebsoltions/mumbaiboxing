"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/Components/footer/Footer";
import Navbar from "@/Components/navbar/Navbar";

const privateRoutePrefixes = [
  "/admin",
  "/complete-registration",
  "/dashboard",
  "/forgot-password",
  "/login",
  "/register",
  "/superadmin",
  "/verify",
];

export default function PublicSiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPrivateRoute = privateRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isPrivateRoute) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
