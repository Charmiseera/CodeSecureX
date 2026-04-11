"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Code2, LayoutDashboard, FileText, Settings, Github } from "lucide-react";

const links = [
  { href: "/",          label: "Home",      icon: Shield },
  { href: "/scan",      label: "Scan Code", icon: Code2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports",   label: "Reports",   icon: FileText },
  { href: "/github",    label: "GitHub",    icon: Github },
  { href: "/admin",     label: "Admin",     icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
