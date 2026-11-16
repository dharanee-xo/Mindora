"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { SparklesIcon, CheckCircleIcon } from "../Icons";

interface LiveSessionHUDProps {
  onSyncValues?: (screenHours: number, breaks: number) => void;
}

export default function LiveSessionHUD({ onSyncValues }: LiveSessionHUDProps) {
  const {
    isAutoMonitoringEnabled,
    activeSessionSeconds,
    sessionStatus,
    autoDetectedScreenHours,
    autoDetectedBreaks,
    pauseResumeAutoMonitoring,
    syncAutoDataToToday,
    disableAutoMonitoring,
  } = useWellbeing();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isAutoMonitoringEnabled) return null;

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSyncClick = () => {
    syncAutoDataToToday();
    if (onSyncValues) {
      onSyncValues(autoDetectedScreenHours, autoDetectedBreaks);
    }
    setToastMessage("Synced to today's log!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#00F5D4]/10 via-[#0d111a] to-[#8A2BE2]/15 border border-[#00F5D4]/30 shadow-glass overflow-hidden transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* Status */}
        <div className="flex items-center space-x-3">
          <span
            className={`flex h-3 w-3 rounded-full ${
              sessionStatus === "active"
                ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                : sessionStatus === "idle"
                ? "bg-amber-400"
                : "bg-slate-500"
            }`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Live Focus Session
              </h4>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  sessionStatus === "active"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : sessionStatus === "idle"
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : "bg-white/10 border-white/20 text-slate-400"
                }`}
              >
                {sessionStatus === "active"
                  ? "Active Focus"
                  : sessionStatus === "idle"
                  ? "Idle Break"
                  : "Paused"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Browser-based local session timer
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="p-2.5 px-3.5 rounded-xl bg-black/60 border border-white/10 text-right">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#00F5D4]">
              {formatTime(activeSessionSeconds)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={pauseResumeAutoMonitoring}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              {sessionStatus === "paused" ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button
              onClick={disableAutoMonitoring}
              className="px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
            >
              Turn Off
            </button>
          </div>
        </div>
      </div>

      {/* Detected values & Sync button */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-5">
          <div>
            <span className="text-slate-400">Detected Screen: </span>
            <span className="font-bold font-mono text-[#00F5D4]">
              {autoDetectedScreenHours} hrs
            </span>
          </div>
          <div>
            <span className="text-slate-400">Detected Breaks: </span>
            <span className="font-bold font-mono text-[#C77DFF]">
              {autoDetectedBreaks} pauses
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {toastMessage && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{toastMessage}</span>
            </span>
          )}

          <button
            onClick={handleSyncClick}
            className="px-4 py-2 rounded-xl font-bold text-xs text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all flex items-center space-x-1.5"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#07090e]" />
            <span>Sync to Today's Log</span>
          </button>
        </div>
      </div>
    </div>
  );
}