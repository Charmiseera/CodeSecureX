"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Code2, LayoutDashboard, Settings, LogOut, LogIn, UserPlus, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const publicLinks = [
  { href: "/",          label: "Home",      icon: Shield },
];

const authedLinks = [
  { href: "/scan",      label: "Scan Code", icon: Code2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const links = [
    ...publicLinks,
    ...(user ? authedLinks : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin", icon: Settings }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-[hsl(222,47%,14%)]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 bg-[hsl(210,100%,56%)] rounded-lg flex items-center justify-center glow transition-transform group-hover:scale-110">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Secure<span className="text-[hsl(210,100%,56%)]">Code</span>AI
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[hsl(210,100%,56%)/0.15] text-[hsl(210,100%,56%)] border border-[hsl(210,100%,56%)/0.3]"
                    : "text-[hsl(215,16%,55%)] hover:text-[hsl(213,31%,91%)] hover:bg-[hsl(222,47%,12%)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* User badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[hsl(215,16%,65%)] bg-[hsl(222,47%,10%)] border border-[hsl(222,47%,18%)]">
                  <User className="w-3.5 h-3.5 text-[hsl(210,100%,56%)]" />
                  <span className="font-medium">{user.username}</span>
                  {user.role === "admin" && (
                    <span className="text-[10px] bg-[hsl(210,100%,56%)/0.2] text-[hsl(210,100%,70%)] px-1.5 py-0.5 rounded-full font-semibold tracking-wide uppercase">
                      admin
                    </span>
                  )}
                </div>
                <button
                  id="logout-btn"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[hsl(0,72%,60%)] hover:bg-[hsl(0,72%,51%)/0.1] border border-transparent hover:border-[hsl(0,72%,51%)/0.3] transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  id="login-link"
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[hsl(215,16%,55%)] hover:text-[hsl(213,31%,91%)] hover:bg-[hsl(222,47%,12%)] transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  id="register-link"
                  href="/register"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[hsl(210,100%,56%)] text-white hover:bg-[hsl(210,100%,48%)] transition-all duration-200"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
