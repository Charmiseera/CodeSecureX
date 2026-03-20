"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scan",      label: "Scan" },
  { href: "/reports",   label: "Reports" },
  { href: "/admin",     label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[hsl(226,12%,10%)] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1 group">
            <span className="font-bold text-lg tracking-tight text-white">
              SecureCode<span className="text-[#aca1fd] opacity-80">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 mt-1">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname === "/" && href === "/dashboard";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-all pb-4 border-b-2 ${
                    active
                      ? "text-white border-[#aca1fd]"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                  style={{ marginBottom: "-17px" }} // aligned with bottom border
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
            {/* Avatar placeholder */}
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e0e0e0" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

      </div>
    </nav>
  );
}
