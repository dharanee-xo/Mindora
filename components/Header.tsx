"use client";

import React, { useState, useEffect } from "react";
import { UserIcon } from "./Icons";
import AuthFlowModal from "./auth/AuthFlowModal";
import Link from "next/link";

interface HeaderProps {
  currentUser?: string | null;
  onSelectTab?: (tabId: string) => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export default function Header({
  currentUser: propUser,
  onSelectTab,
  onOpenAuth,
  onSignOut,
}: HeaderProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(propUser || null);

  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
      return;
    }
    try {
      const user = localStorage.getItem("mindora_active_user");
      if (user) setCurrentUser(user);
    } catch (e) {
      console.warn("Storage check:", e);
    }
  }, [propUser]);

  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    const el = document.getElementById("digital-wellbeing-module");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoginSuccess = (handle: string) => {
    setCurrentUser(handle);
    try {
      localStorage.setItem("mindora_active_user", handle);
    } catch (e) {
      console.warn("Storage write:", e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#07090e]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F5D4]/20 to-[#8A2BE2]/20 border border-white/10 shadow-sm group"
            >
              <span className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#C77DFF] group-hover:scale-105 transition-transform">
                M
              </span>
            </Link>

            <div>
              <Link
                href="/"
                className="text-lg sm:text-xl font-black tracking-tight text-white hover:text-slate-200 transition-colors"
              >
                MINDORA
              </Link>
            </div>
          </div>

          {/* Clean Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => handleTabClick("dashboard")}
              className="hover:text-[#00F5D4] transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => handleTabClick("monitoring")}
              className="hover:text-[#00F5D4] transition-colors"
            >
              Daily Log
            </button>
            <button
              onClick={() => handleTabClick("habits")}
              className="hover:text-[#C77DFF] transition-colors"
            >
              Habits
            </button>
            <button
              onClick={() => handleTabClick("support")}
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center space-x-1"
            >
              <span>Tele-MANAS (14416)</span>
            </button>
          </nav>

          {/* User Status & Quick Exit */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-200">
                <UserIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span className="truncate max-w-[120px]">{currentUser}</span>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    title="Sign out"
                    className="text-[11px] text-slate-400 hover:text-rose-400 ml-1 transition-colors"
                  >
                    (Sign Out)
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth || (() => setIsAuthOpen(true))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8A2BE2]/40 to-[#00F5D4]/30 hover:from-[#8A2BE2]/60 hover:to-[#00F5D4]/50 border border-white/15 transition-all"
              >
                Sign In
              </button>
            )}

            {/* Quick Exit */}
            <button
              onClick={handleQuickExit}
              title="Immediately opens Google"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal (if triggered internally) */}
      <AuthFlowModal
        isOpen={isAuthOpen}
        initialView="login"
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}