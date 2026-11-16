"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { SparklesIcon, CheckCircleIcon, FlameIcon } from "../Icons";

export default function HabitTracker() {
  const { habits, toggleHabit, habitCompletionRate } = useWellbeing();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const completedCount = habits.filter((h) => h.completed).length;

  const filteredHabits = selectedFilter === "all"
    ? habits
    : habits.filter((h) => h.category === selectedFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleek Top Progress Bar */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
                Daily Focus Goals
              </span>
              <span className="text-xs font-mono text-slate-400">
                • {completedCount} of {habits.length} Done
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Habit Checklist
            </h3>
          </div>

          {/* Clean Metric Badge */}
          <div className="flex items-center space-x-3 bg-white/[0.03] p-3 px-4 rounded-2xl border border-white/10 self-start sm:self-auto">
            <span className="text-2xl font-extrabold font-mono text-white">
              {habitCompletionRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {completedCount >= 5 ? "Optimal Rhythm" : "In Progress"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full h-2 bg-black/40 rounded-full overflow-hidden p-0 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#C77DFF] rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(0,245,212,0.5)]"
            style={{ width: `${habitCompletionRate}%` }}
          />
        </div>

        {/* 1-Line Motivational Feedback */}
        <p className="text-xs text-slate-400 mt-3 flex items-center space-x-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>
            {habitCompletionRate >= 70
              ? "Great momentum. You are prioritizing restorative offline recovery."
              : "Every single offline pause counts. Take your time without pressure."}
          </span>
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Goals" },
          { id: "screen", label: "Screen & Eyes" },
          { id: "sleep", label: "Sleep" },
          { id: "body", label: "Movement" },
          { id: "mind", label: "Offline Mind" },
          { id: "social", label: "Social" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === f.id
                ? "bg-[#00F5D4] text-[#07090e] font-bold shadow-[0_0_12px_rgba(0,245,212,0.3)]"
                : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Spacious 2-Column Habit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`p-4 sm:p-5 rounded-2xl glass-panel-interactive border cursor-pointer select-none transition-all flex items-start space-x-3.5 ${
              habit.completed
                ? "border-[#00F5D4]/40 bg-gradient-to-r from-[#00F5D4]/[0.05] to-transparent shadow-[0_0_15px_rgba(0,245,212,0.08)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {/* Custom Checkbox */}
            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                habit.completed
                  ? "bg-[#00F5D4] border-[#00F5D4] text-[#07090e] shadow-[0_0_8px_rgba(0,245,212,0.5)]"
                  : "border-white/30 bg-white/5 hover:border-[#00F5D4]"
              }`}
            >
              {habit.completed && (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-sm font-bold transition-colors ${
                    habit.completed ? "text-slate-300 line-through opacity-75" : "text-white"
                  }`}
                >
                  {habit.title}
                </h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                  {habit.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                {habit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
