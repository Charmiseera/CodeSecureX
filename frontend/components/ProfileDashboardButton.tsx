"use client";

import React, { useState } from "react";
import { User, LogOut, Settings, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileDashboardButton() {
  const [isOpen, setIsOpen] = useState(false);
  const username = "Admin"; // In real app, get from state/context

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 mb-2 w-64 bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-[#00f0ff]/10 to-transparent">
              <div className="w-10 h-10 rounded-full bg-[#00f0ff]/20 flex items-center justify-center border border-[#00f0ff]/30 text-[#00f0ff]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{username}</h4>
                <p className="text-[#00f0ff] text-xs">Security Lead</p>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> Preferences
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Award className="w-4 h-4" /> Subscription
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0a0a14] border border-white/10 hover:border-[#00f0ff]/50 rounded-full flex items-center justify-center shadow-lg transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/20 to-[#8b5cf6]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <img 
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=transparent`} 
          alt="Profile" 
          className="w-12 h-12 rounded-full relative z-10" 
        />
      </button>
    </div>
  );
}
