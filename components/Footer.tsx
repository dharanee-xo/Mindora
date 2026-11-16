"use client";

import React from "react";
import { ShieldIcon, LockIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/[0.06] bg-[#07090e]/95 backdrop-blur-xl py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-white tracking-wider">MINDORA</span>
          <span className="text-slate-600">•</span>
          <span>Digital Youth Wellness & Harm Prevention</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] font-mono">
          <span className="flex items-center space-x-1 text-[#00F5D4]">
            <LockIcon className="w-3 h-3" />
            <span>Zero PII • Local Browser Memory</span>
          </span>
          <span className="text-slate-600">•</span>
          <a href="tel:14416" className="text-rose-300 hover:text-white transition-colors">
            Tele-MANAS: 14416 (24x7 India)
          </a>
        </div>
      </div>
    </footer>
  );
}
