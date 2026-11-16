"use client";

import React, { useState } from "react";
import { MessageSquareIcon, SearchIcon, ShieldIcon } from "./Icons";
import CounselorChatModal from "./CounselorChatModal";
import IncidentModal from "./IncidentModal";

export default function SupportHubCard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);

  return (
    <>
      <div className="relative group rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden shadow-glass border-glow-teal/30 hover:border-glow-purple/40">
        {/* Dual Neon Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00F5D4]/15 to-[#8A2BE2]/15 rounded-full blur-3xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#00F5D4]">
              Confidential Support
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available 24/7</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Secure Support Hub
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect anonymously with trained counselors, peer listeners, or file a private incident report.
          </p>

          {/* Quick Metrics */}
          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-base font-bold text-white font-mono">&lt; 2 min</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Response Time</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-base font-bold text-[#00F5D4] font-mono">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Confidential</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full relative flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8A2BE2] to-[#7B2CBF] hover:from-[#9D4EDD] hover:to-[#8A2BE2] shadow-[0_0_20px_rgba(138,43,226,0.3)] transition-all duration-200"
          >
            <MessageSquareIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>Anonymous Counselor Chat</span>
          </button>

          <button
            onClick={() => setIsIncidentOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-200"
          >
            <SearchIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Track Incident Status</span>
          </button>
        </div>
      </div>

      {/* Counselor Chat Modal */}
      <CounselorChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Incident Tracker Modal */}
      <IncidentModal isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} />
    </>
  );
}