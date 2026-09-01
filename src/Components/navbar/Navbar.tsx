"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const links = [
  { label: "Home",        href: "/" },
  { label: "About",       href: "#about" },
  { label: "Tournaments", href: "/events" },
  { label: "Rankings",    href: "/dashboard/ranking" },
  { label: "Academies",   href: "#academies" },
  { label: "News",        href: "#news" },
  { label: "Contact",     href: "#contact" },
];

type AuthUser = { email: string; role: string } | null;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d?.role) setUser({ email: d.email, role: d.role }); })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const dashboardHref = user?.role === "superadmin" ? "/dashboard/admin/boxers" : "/dashboard";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-sm flex items-center justify-center font-display text-lg text-white"
            style={{ background: "linear-gradient(135deg,#EF4444,#991B1B)", border: "1px solid rgba(255,255,255,0.15)" }}>
            🥊
          </div>
          <div className="leading-tight">
            <div className="font-display text-base tracking-widest text-white">
              MUMBAI <span style={{ color: "#EF4444" }}>BOXING</span>
            </div>
            <div className="text-[9px] tracking-[0.25em] text-slate-400">ASSOCIATION</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm text-slate-300 hover:text-[#EF4444] px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!checked ? (
            <div className="w-32 h-9 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          ) : user ? (
            <>
              <Link href={dashboardHref} className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition-all">
                Logout
              </button>
            </>
          ) : (
            <Link href="/register"
              className="text-sm font-bold text-white px-5 py-2.5 rounded transition-all"
              style={{ background: "#DC2626" }}>
              Register / Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-300 hover:text-[#EF4444] transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 space-y-1"
          style={{ background: "#0F172B" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-[#EF4444] px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}

          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{user.email.split("@")[0]}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link href={dashboardHref} onClick={() => setOpen(false)}
                  className="btn-gold block text-center text-sm px-5 py-2.5 rounded-xl">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-center text-sm px-5 py-2.5 rounded-xl text-red-400 hover:bg-white/5 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="btn-ghost block text-center text-sm px-5 py-2.5 rounded-xl">
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="btn-gold block text-center text-sm px-5 py-2.5 rounded-xl">
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
