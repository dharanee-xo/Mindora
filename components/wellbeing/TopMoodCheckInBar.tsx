"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { MoodRating } from "@/types/wellbeing";
import { CheckCircleIcon } from "../Icons";

interface MoodOption {
  id: string;
  label: "Positive" | "Neutral" | "Negative" | "Depressed";
  rating: MoodRating;
  emoji: string;
  colorClass: string;
  activeBorder: string;
  activeBg: string;
  note: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "positive",
    label: "Positive",
    rating: 4,
    emoji: "😊",
    colorClass: "text-emerald-400",
    activeBorder: "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    activeBg: "bg-emerald-500/15 text-white",
    note: "Feeling grounded & focused today.",
  },
  {
    id: "neutral",
    label: "Neutral",
    rating: 3,
    emoji: "😐",
    colorClass: "text-[#00F5D4]",
    activeBorder: "border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.3)]",
    activeBg: "bg-[#00F5D4]/15 text-white",
    note: "Steady, ordinary daily flow.",
  },
  {
    id: "negative",
    label: "Negative",
    rating: 2,
    emoji: "😟",
    colorClass: "text-amber-400",
    activeBorder: "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    activeBg: "bg-amber-500/15 text-white",
    note: "Academic pressure or fatigue present.",
  },
  {
    id: "depressed",
    label: "Depressed",
    rating: 1,
    emoji: "🌧️",
    colorClass: "text-rose-400",
    activeBorder: "border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    activeBg: "bg-rose-500/15 text-white",
    note: "Feeling low or overwhelmed. Remember support is available.",
  },
];

export default function TopMoodCheckInBar() {
  const { activeLog, updateTodayMood } = useWellbeing();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map activeLog.mood (1-5) to our 4 categories
  const currentSelectedMood = activeLog?.mood ?? 3;

  const handleSelectMood = (option: MoodOption) => {
    updateTodayMood(option.rating);
    setToastMessage(`Mood updated: ${option.label}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-sm">✨</span>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            How are you feeling today?
          </h3>
        </div>

        {toastMessage ? (
          <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 animate-fadeIn">
            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">
            Daily Emotional Pulse
          </span>
        )}
      </div>

      {/* 4 Quick Select Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        {MOOD_OPTIONS.map((opt) => {
          const isSelected =
            currentSelectedMood === opt.rating ||
            (opt.rating === 4 && currentSelectedMood >= 4) ||
            (opt.rating === 1 && currentSelectedMood <= 1);

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectMood(opt)}
              type="button"
              className={`p-3 rounded-xl border transition-all text-left flex items-center space-x-3 group ${
                isSelected
                  ? `${opt.activeBorder} ${opt.activeBg}`
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-2xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {opt.emoji}
              </span>
              <div className="min-w-0">
                <span
                  className={`block text-xs font-bold ${
                    isSelected ? "text-white" : opt.colorClass
                  }`}
                >
                  {opt.label}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {opt.note}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
