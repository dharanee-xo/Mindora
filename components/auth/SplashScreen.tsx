"use client";

import React from "react";
import Futuristic3DLogo from "./Futuristic3DLogo";
import { ArrowRightIcon } from "../Icons";

interface SplashScreenProps {
  onGetStarted: () => void;
  onExploreGuest?: () => void;
  autoTransitionMs?: number;
}

export default function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-tr from-[#00F5D4]/15 via-[#8A2BE2]/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Centered Clean Mindora Logo + Get Started Button Only */}
      <div className="flex flex-col items-center space-y-8 my-auto">
        {/* Clean Logo Emblem */}
        <div className="relative transform hover:scale-105 transition-transform duration-500">
          <Futuristic3DLogo size={140} />
        </div>

        {/* Clean Brand Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-white font-sans uppercase">
          MIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#C77DFF]">DORA</span>
        </h1>

        {/* Action Button: Get Started */}
        <div className="w-full max-w-xs pt-2">
          <button
            onClick={onGetStarted}
            className="w-full relative flex items-center justify-center space-x-2 py-3.5 px-7 rounded-2xl font-bold text-xs sm:text-sm text-[#07090e] bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#00F5D4] hover:bg-gradient-to-l shadow-[0_0_25px_rgba(0,245,212,0.4)] hover:shadow-[0_0_35px_rgba(0,245,212,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
