"use client";

import React from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import WellbeingCharts from "./WellbeingCharts";
import { ClockIcon, FlameIcon, CheckCircleIcon } from "../Icons";

interface WellbeingDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export default function WellbeingDashboard({ onNavigateTab }: WellbeingDashboardProps) {
  const {
    activeLog,
    logs,
    habits,
    habitCompletionRate,
    isAutoMonitoringEnabled,
    activeSessionSeconds,
    sessionStatus,
  } = useWellbeing();

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedHabitsCount = habits.filter((h) => h.completed).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. 4 CORE METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Screen-Time */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel-interactive border-glow-teal/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Screen-Time</span>
              <ClockIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {activeLog.screenTimeHours}
              </span>
              <span className="text-xs font-semibold text-[#00F5D4]">hrs</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5 font-mono">
            <span>Social: {activeLog.socialMediaHours}h</span>
            <span>Gaming: {activeLog.gamingHours}h</span>
          </div>
        </div>

        {/* Metric 2: Active Streak */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel-interactive border-glow-purple/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Active Streak</span>
              <FlameIcon className="w-3.5 h-3.5 text-[#C77DFF]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#C77DFF] font-mono tracking-tight">
                12
              </span>
              <span className="text-xs font-semibold text-purple-200">days</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-1 pt-2 border-t border-white/5 font-mono">
            <span className="text-emerald-400">● Consistent</span>
            <span>• 6 Pauses</span>
          </div>
        </div>

        {/* Metric 3: Habits Completed */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Habit Goals</span>
              <CheckCircleIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {habitCompletionRate}%
              </span>
              <span className="text-xs font-semibold text-[#00F5D4]">done</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span>{completedHabitsCount}/{habits.length} goals</span>
            <button
              onClick={() => onNavigateTab("habits")}
              className="text-[#00F5D4] hover:underline font-semibold"
            >
              Checklist →
            </button>
          </div>
        </div>

        {/* Metric 4: Live Focus Session / Auto-Sync */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Focus Timer</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAutoMonitoringEnabled
                    ? sessionStatus === "active"
                      ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                      : "bg-amber-400"
                    : "bg-slate-500"
                }`}
              />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#00F5D4] font-mono tracking-tight">
                {isAutoMonitoringEnabled ? formatTime(activeSessionSeconds) : "Manual"}
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span className="truncate max-w-[110px]">
              {isAutoMonitoringEnabled ? (sessionStatus === "active" ? "Active Focus" : "Idle Break") : "Sync Ready"}
            </span>
            <button
              onClick={() => onNavigateTab("monitoring")}
              className="text-[#00F5D4] hover:underline font-semibold font-mono"
            >
              {isAutoMonitoringEnabled ? "Sync →" : "Enable →"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WEEKLY CHART CARD */}
      <div className="p-5 sm:p-7 rounded-2xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Weekly Screen-Time & Sleep Rhythm
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily screen balance compared with restorative sleep.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("monitoring")}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>+ Log Today's Numbers</span>
          </button>
        </div>

        <div className="mt-5">
          <WellbeingCharts logs={logs} />
        </div>
      </div>
    </div>
  );
}