"use client";

import React, { useState } from "react";
import { FlameIcon, ClockIcon, ActivityIcon } from "./Icons";

export default function HabitTrackerCard() {
  const [screenFreeHours, setScreenFreeHours] = useState(4.8);
  const [activeStreak, setActiveStreak] = useState(12);
  const [mindfulPauses, setMindfulPauses] = useState(6);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddBreak = () => {
    setScreenFreeHours((prev) => +(prev + 0.5).toFixed(1));
    setMindfulPauses((prev) => prev + 1);
    setToastMessage("+30m Screen-Free Pause Added!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const days = [
    { label: "M", completed: true },
    { label: "T", completed: true },
    { label: "W", completed: true },
    { label: "T", completed: true },
    { label: "F", completed: true },
    { label: "S", completed: true },
    { label: "S", completed: false, current: true },
  ];

  return (
    <div className="relative group rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden shadow-glass border-glow-purple/40">
      {/* Subtle Ambient Orchid Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8A2BE2]/15 rounded-full blur-3xl group-hover:bg-[#8A2BE2]/25 transition-all duration-700 pointer-events-none" />

      <div>
        {/* Module Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#C77DFF]">
            Habits & Rhythms
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Weekly Focus
          </span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Digital Detox & Habit Tracker
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Track screen-free hours, mindful study pauses, and active streaks to build balanced daily routines.
        </p>

        {/* Highlighted Metrics Display Blocks */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* Block 1: Screen-Free Hours */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium">Screen-Free</span>
              <ClockIcon className="w-3.5 h-3.5 text-[#C77DFF]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-white font-mono">
                {screenFreeHours}
              </span>
              <span className="text-xs font-semibold text-[#C77DFF]">hrs</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Offline time today</p>
          </div>

          {/* Block 2: Active Streak Days */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#8A2BE2]/20 via-white/[0.02] to-transparent border border-[#8A2BE2]/40 shadow-[0_0_15px_rgba(138,43,226,0.15)]">
            <div className="flex items-center justify-between text-purple-200 mb-1.5">
              <span className="text-xs font-medium">Streak</span>
              <FlameIcon className="w-3.5 h-3.5 text-[#C77DFF]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-[#C77DFF] font-mono">
                {activeStreak}
              </span>
              <span className="text-xs font-semibold text-purple-200">days</span>
            </div>
            <p className="mt-1 text-[11px] text-purple-200/70">Consistent streak</p>
          </div>
        </div>

        {/* 7-Day Rhythm */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Daily Milestone Rhythm</span>
            <span className="text-[#C77DFF] font-mono text-[11px]">{mindfulPauses} pauses logged</span>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-1">
            {days.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    day.completed
                      ? "bg-gradient-to-br from-[#8A2BE2] to-[#9D4EDD] text-white"
                      : day.current
                      ? "border border-[#8A2BE2] text-white"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {day.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={handleAddBreak}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-[#8A2BE2]/50 transition-all duration-200"
        >
          <ActivityIcon className="w-3.5 h-3.5 text-[#C77DFF]" />
          <span>{toastMessage || "+ Log 30m Screen-Free Break"}</span>
        </button>
      </div>
    </div>
  );
}