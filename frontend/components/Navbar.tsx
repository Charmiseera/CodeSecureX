"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, User, Settings, Award, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scan",      label: "Scan" },
  { href: "/reports",   label: "Reports" },
  { href: "/admin",     label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
        <div className="flex items-center gap-4 relative">
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-transparent hover:border-[#aca1fd] transition-all overflow-hidden flex items-center justify-center focus:outline-none"
            >
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 mt-2 w-64 bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-[100]"
                >
                  <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-[#aca1fd]/10 to-transparent">
                    <div className="w-10 h-10 rounded-full bg-[#aca1fd]/20 flex items-center justify-center border border-[#aca1fd]/30 text-[#aca1fd]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Main User</h4>
                      <p className="text-[#aca1fd] text-xs">Security Dashboard</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                      <Award className="w-4 h-4" /> My Plan
                    </button>
                    <div className="h-px bg-white/10 my-1 mx-2"></div>
                    <button 
                      onClick={() => {
                        window.location.href = "/";
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </nav>
  );
}
