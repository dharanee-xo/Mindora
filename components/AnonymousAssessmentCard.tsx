"use client";

import React, { useState } from "react";
import { SparklesIcon, ArrowRightIcon } from "./Icons";
import CheckInModal from "./CheckInModal";

export default function AnonymousAssessmentCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative group rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden shadow-glass border-glow-teal/40">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F5D4]/10 rounded-full blur-3xl group-hover:bg-[#00F5D4]/20 transition-all duration-700 pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#00F5D4]">
              Self-Assessment
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Private Check-in
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Anonymous Self-Assessment
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Evaluate stress levels, cognitive fatigue, and digital wellness patterns securely without logging an identity.
          </p>

          {/* Interactive Micro Progress Section */}
          <div className="mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>Wellness State</span>
              </span>
              <span className="font-mono font-bold text-[#00F5D4] text-xs">
                Step 2 of 4
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-[#00F5D4] to-[#48CAE4] rounded-full shadow-[0_0_12px_rgba(0,245,212,0.6)] transition-all duration-500"
                style={{ width: "50%" }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Next: Screen Stress Factors</span>
              <span className="font-mono text-[#00F5D4]">50%</span>
            </div>
          </div>
        </div>

        {/* CTA Action Button */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full group/btn relative flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all duration-200"
          >
            <span>Start Check-in</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      <CheckInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}