"use client";

import React, { useState, useEffect } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { MoodRating } from "@/types/wellbeing";
import { CheckCircleIcon, SparklesIcon, ClockIcon } from "../Icons";

interface MoodOption {
  id: string;
  label: "Positive" | "Neutral" | "Negative" | "Depressed";
  rating: MoodRating;
  defaultScore: number;
  defaultStress: number;
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
    defaultScore: 8,
    defaultStress: 2,
    emoji: "😊",
    colorClass: "text-emerald-400",
    activeBorder: "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    activeBg: "bg-emerald-500/15 text-white",
    note: "Grounded & focused",
  },
  {
    id: "neutral",
    label: "Neutral",
    rating: 3,
    defaultScore: 6,
    defaultStress: 4,
    emoji: "😐",
    colorClass: "text-[#00F5D4]",
    activeBorder: "border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.3)]",
    activeBg: "bg-[#00F5D4]/15 text-white",
    note: "Steady daily flow",
  },
  {
    id: "negative",
    label: "Negative",
    rating: 2,
    defaultScore: 4,
    defaultStress: 7,
    emoji: "😟",
    colorClass: "text-amber-400",
    activeBorder: "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    activeBg: "bg-amber-500/15 text-white",
    note: "Academic fatigue",
  },
  {
    id: "depressed",
    label: "Depressed",
    rating: 1,
    defaultScore: 2,
    defaultStress: 9,
    emoji: "🌧️",
    colorClass: "text-rose-400",
    activeBorder: "border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    activeBg: "bg-rose-500/15 text-white",
    note: "Overwhelmed / Low",
  },
];

export default function TopMoodCheckInBar() {
  const { activeLog, addOrUpdateLog, isSaving } = useWellbeing();

  // Local state for fine-grained 1-10 metrics
  const [moodScore, setMoodScore] = useState<number>(activeLog?.moodScore ?? 7);
  const [stressLevel, setStressLevel] = useState<number>(activeLog?.stressLevel ?? 3);
  const [sleepHours, setSleepHours] = useState<number>(activeLog?.sleepHours ?? 7.5);
  const [screenTimeHours, setScreenTimeHours] = useState<number>(activeLog?.screenTimeHours ?? 4.8);
  const [selectedLabel, setSelectedLabel] = useState<string>(activeLog?.mood ? String(activeLog.mood) : "Neutral");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Sync with activeLog if it changes externally
  useEffect(() => {
    if (activeLog) {
      if (activeLog.moodScore !== undefined) setMoodScore(activeLog.moodScore);
      if (activeLog.stressLevel !== undefined) setStressLevel(activeLog.stressLevel);
      if (activeLog.sleepHours !== undefined) setSleepHours(activeLog.sleepHours);
      if (activeLog.screenTimeHours !== undefined) setScreenTimeHours(activeLog.screenTimeHours);
    }
  }, [activeLog]);

  const handleSelectMood = async (option: MoodOption) => {
    setSelectedLabel(option.label);
    setMoodScore(option.defaultScore);
    setStressLevel(option.defaultStress);

    const todayStr = new Date().toISOString().split("T")[0];
    const screenMinutes = Math.round(screenTimeHours * 60);

    try {
      await addOrUpdateLog({
        ...activeLog,
        date: todayStr,
        mood: option.rating,
        moodScore: option.defaultScore,
        stressLevel: option.defaultStress,
        sleepHours,
        screenTimeHours,
        screenTimeMinutes: screenMinutes,
      });

      setToastMessage(`Logged: ${option.label} (${option.defaultScore}/10)`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.warn("Check-in save warning:", err);
    }
  };

  const handleSaveMetrics = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const screenMinutes = Math.round(screenTimeHours * 60);
    const calculatedRating: MoodRating =
      moodScore >= 8 ? 4 : moodScore >= 6 ? 3 : moodScore >= 4 ? 2 : 1;

    try {
      await addOrUpdateLog({
        ...activeLog,
        date: todayStr,
        mood: calculatedRating,
        moodScore,
        stressLevel,
        sleepHours,
        screenTimeHours,
        screenTimeMinutes: screenMinutes,
      });

      setToastMessage("Daily metrics saved to database!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Save metrics error:", err);
    }
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-[#00F5D4]" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Daily Emotional Pulse & Wellness Check-In
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {toastMessage ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 animate-fadeIn">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{toastMessage}</span>
            </span>
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-[#00F5D4] hover:underline font-mono"
            >
              {isExpanded ? "Hide Sliders ↑" : "Tune Metrics (1-10) ↓"}
            </button>
          )}
        </div>
      </div>

      {/* 4 Quick Select Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        {MOOD_OPTIONS.map((opt) => {
          const isSelected =
            selectedLabel === opt.label ||
            (opt.id === "positive" && moodScore >= 8) ||
            (opt.id === "neutral" && moodScore >= 6 && moodScore < 8) ||
            (opt.id === "negative" && moodScore >= 4 && moodScore < 6) ||
            (opt.id === "depressed" && moodScore < 4);

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
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
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

      {/* Fine-Grained Sliders (Mood 1-10, Stress 1-10, Sleep, Screen-Time) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood Score (1-10) */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Mood Score (1-10)</span>
                <span className="font-mono font-bold text-[#00F5D4]">{moodScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="w-full accent-[#00F5D4] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 (Low)</span>
                <span>5 (Neutral)</span>
                <span>10 (Thriving)</span>
              </div>
            </div>

            {/* Stress Level (1-10) */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Stress Level (1-10)</span>
                <span
                  className={`font-mono font-bold ${
                    stressLevel <= 3
                      ? "text-emerald-400"
                      : stressLevel <= 6
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {stressLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-[#C77DFF] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 (Calm)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Sleep Duration</span>
                <span className="font-mono font-bold text-[#C77DFF]">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#8A2BE2] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3h (Deprived)</span>
                <span>7.5h (Optimal)</span>
                <span>12h</span>
              </div>
            </div>

            {/* Screen Time Hours */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Screen Time</span>
                <span className="font-mono font-bold text-[#00F5D4]">
                  {screenTimeHours}h ({Math.round(screenTimeHours * 60)}m)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.5"
                value={screenTimeHours}
                onChange={(e) => setScreenTimeHours(Number(e.target.value))}
                className="w-full accent-[#00F5D4] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5h (Minimal)</span>
                <span>5h (Average)</span>
                <span>14h (High)</span>
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveMetrics}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all flex items-center space-x-1.5 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#07090e] border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-3.5 h-3.5 text-[#07090e]" />
                  <span>Save Check-In to MongoDB</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
