"use client";
import { useEffect, useState } from "react";

export function useRole() {
  const [role, setRole] = useState("");
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.role) setRole(d.role); })
      .catch(() => {});
  }, []);
  return role;
}
