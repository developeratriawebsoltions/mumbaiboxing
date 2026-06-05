"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home",        href: "/" },
  { label: "Rankings",    href: "/dashboard/ranking" },
  { label: "Tournaments", href: "/dashboard/tournament" },
  { label: "Boxers",      href: "/dashboard/boxer" },
  { label: "Academies",   href: "/dashboard/academy" },
  { label: "About",       href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: "rgba(11,17,32,0.92)", backdropFilter: "blur(18px)" }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-lg text-[#0B1120]"
            style={{ background: "linear-gradient(135deg,#F0C040,#D4A017)" }}>
            M
          </div>
          <span className="font-display text-xl tracking-wider text-white group-hover:text-[#F0C040] transition-colors">
            MUMBAI <span style={{ color: "#D4A017" }}>BOXING</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm text-slate-300 hover:text-[#F0C040] px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
            Login
          </Link>
          <Link href="/register" className="btn-gold text-sm px-5 py-2 rounded-xl">
            Register Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-300 hover:text-[#F0C040] transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 space-y-1"
          style={{ background: "#0B1120" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-[#F0C040] px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}
              className="btn-ghost block text-center text-sm px-5 py-2.5 rounded-xl">
              Login
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}
              className="btn-gold block text-center text-sm px-5 py-2.5 rounded-xl">
              Register Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
