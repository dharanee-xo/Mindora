"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { DailyLog, MoodRating } from "@/types/wellbeing";
import AutoMonitoringGuardrailModal from "./AutoMonitoringGuardrailModal";
import LiveSessionHUD from "./LiveSessionHUD";
import { CheckCircleIcon, LockIcon } from "../Icons";

export default function DailyMonitoringSystem() {
  const {
    logs,
    addOrUpdateLog,
    deleteLog,
    isAutoMonitoringEnabled,
    isPermissionGranted,
    enableAutoMonitoring,
    disableAutoMonitoring,
  } = useWellbeing();

  const [isGuardrailOpen, setIsGuardrailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dayLabel, setDayLabel] = useState("Today");
  const [screenTimeHours, setScreenTimeHours] = useState(5.0);
  const [socialMediaHours, setSocialMediaHours] = useState(1.5);
  const [gamingHours, setGamingHours] = useState(0.5);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [studyHours, setStudyHours] = useState(4.5);
  const [breaksCount, setBreaksCount] = useState(5);
  const [physicalActivityMinutes, setPhysicalActivityMinutes] = useState(30);
  const [mood, setMood] = useState<MoodRating>(4);
  const [privateNotes, setPrivateNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const moods: { rating: MoodRating; label: string; desc: string }[] = [
    { rating: 1, label: "Exhausted", desc: "Overwhelmed" },
    { rating: 2, label: "Tense", desc: "Heavy pressure" },
    { rating: 3, label: "Neutral", desc: "Steady balance" },
    { rating: 4, label: "Positive", desc: "Grounded & focused" },
    { rating: 5, label: "Radiant", desc: "Energized" },
  ];

  const handleToggleAutoSwitch = () => {
    if (!isAutoMonitoringEnabled) {
      if (!isPermissionGranted) {
        setIsGuardrailOpen(true);
      } else {
        enableAutoMonitoring();
      }
    } else {
      disableAutoMonitoring();
    }
  };

  const handleSyncValuesFromHUD = (screen: number, breaks: number) => {
    setScreenTimeHours(screen);
    setBreaksCount(breaks);
    setToastMessage("Auto-detected numbers populated into form.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEditClick = (log: DailyLog) => {
    setEditingId(log.id);
    setDate(log.date);
    setDayLabel(log.dayLabel);
    setScreenTimeHours(log.screenTimeHours);
    setSocialMediaHours(log.socialMediaHours);
    setGamingHours(log.gamingHours);
    setSleepHours(log.sleepHours);
    setStudyHours(log.studyHours);
    setBreaksCount(log.breaksCount);
    setPhysicalActivityMinutes(log.physicalActivityMinutes);
    setMood(log.mood);
    setPrivateNotes(log.privateNotes || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPrivateNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addOrUpdateLog(
      {
        date,
        dayLabel: editingId ? dayLabel : "Logged Entry",
        screenTimeHours: Number(screenTimeHours),
        socialMediaHours: Number(socialMediaHours),
        gamingHours: Number(gamingHours),
        sleepHours: Number(sleepHours),
        studyHours: Number(studyHours),
        breaksCount: Number(breaksCount),
        physicalActivityMinutes: Number(physicalActivityMinutes),
        mood,
        privateNotes,
        isAutoTracked: isAutoMonitoringEnabled,
      },
      editingId || undefined
    );

    setToastMessage(editingId ? "Entry updated!" : "Daily record logged!");
    setTimeout(() => setToastMessage(null), 2500);
    setEditingId(null);
    setPrivateNotes("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. DUAL MODE MONITORING TOGGLE CARD */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#00F5D4]">
                Tracking Mode
              </span>
              <span className="text-xs font-mono text-slate-400">
                • {isAutoMonitoringEnabled ? "Auto-Sync Active" : "Manual Logging (Default)"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Activity Monitoring Preferences
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Log activity manually or enable Smart Activity Sync for local session detection.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center space-x-3 bg-white/[0.03] px-3.5 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto">
            <div className="text-left">
              <span className="text-xs font-semibold text-white block">
                Smart Activity Sync
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isAutoMonitoringEnabled ? "Local Sync ON" : "Manual Default"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleAutoSwitch}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAutoMonitoringEnabled ? "bg-[#00F5D4]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#07090e] shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAutoMonitoringEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. LIVE ACTIVE SESSION HUD (Active when Auto-Monitoring is ON) */}
      {isAutoMonitoringEnabled && (
        <LiveSessionHUD onSyncValues={handleSyncValuesFromHUD} />
      )}

      {/* 3. INPUT FORM CARD */}
      <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{editingId ? "Edit Activity Record" : "Daily Activity Log"}</span>
              {isAutoMonitoringEnabled && (
                <span className="px-2 py-0.5 text-[10px] font-mono text-[#00F5D4] bg-[#00F5D4]/10 rounded border border-[#00F5D4]/20">
                  Auto-Sync
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust your daily values below. You can edit entries at any time.
            </p>
          </div>

          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-white/10"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Screen Time Hours */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Total Screen-Time</label>
                <span className="font-mono font-bold text-[#00F5D4] text-sm">{screenTimeHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={screenTimeHours}
                onChange={(e) => setScreenTimeHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F5D4]"
              />
              <span className="text-[11px] text-slate-400 block">Laptops, phones & tablets</span>
            </div>

            {/* Social Media Hours */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Social Media</label>
                <span className="font-mono font-bold text-[#C77DFF] text-sm">{socialMediaHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={socialMediaHours}
                onChange={(e) => setSocialMediaHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8A2BE2]"
              />
              <span className="text-[11px] text-slate-400 block">Feeds, reels & short videos</span>
            </div>

            {/* Gaming Hours */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Gaming</label>
                <span className="font-mono font-bold text-sky-400 text-sm">{gamingHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={gamingHours}
                onChange={(e) => setGamingHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <span className="text-[11px] text-slate-400 block">Console, PC & mobile</span>
            </div>

            {/* Sleep Hours */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Sleep Duration</label>
                <span className="font-mono font-bold text-[#C77DFF] text-sm">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8A2BE2]"
              />
              <span className="text-[11px] text-slate-400 block">Target: 7 to 9 hours nightly</span>
            </div>

            {/* Study Hours */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Focused Study</label>
                <span className="font-mono font-bold text-[#00F5D4] text-sm">{studyHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F5D4]"
              />
              <span className="text-[11px] text-slate-400 block">Productive work & classes</span>
            </div>

            {/* Breaks */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Study Pauses</label>
                <span className="font-mono font-bold text-amber-300 text-sm">{breaksCount} breaks</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={breaksCount}
                onChange={(e) => setBreaksCount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[11px] text-slate-400 block">Eye relaxation & stretch breaks</span>
            </div>
          </div>

          {/* Daily Mood Selection */}
          <div className="space-y-2.5 pt-2">
            <label className="block text-xs font-semibold text-slate-200">
              Daily Mood Rating
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.rating}
                  onClick={() => setMood(m.rating)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    mood === m.rating
                      ? "bg-[#00F5D4]/15 border-[#00F5D4] text-white"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{m.label}</span>
                    <span className="text-xs font-mono text-[#00F5D4]">{m.rating}/5</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Private Reflection Note */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-slate-300">
              Private Note (Optional)
            </label>
            <textarea
              rows={2}
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="e.g. Felt calmer after taking an outdoor walk during study breaks..."
              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5D4]"
            />
          </div>

          {/* Submit & Toast */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {toastMessage ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                <span>{toastMessage}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Saved in local browser memory
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all"
            >
              {editingId ? "Update Record" : "Save Record"}
            </button>
          </div>
        </form>
      </div>

      {/* 4. RECENT HISTORY TABLE */}
      <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">Recent Activity History</h4>
            <p className="text-xs text-slate-400">Review or adjust your past entries.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{logs.length} entries</span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-2">Date</th>
                <th className="py-2.5 px-2">Screen</th>
                <th className="py-2.5 px-2">Social</th>
                <th className="py-2.5 px-2">Sleep</th>
                <th className="py-2.5 px-2">Study</th>
                <th className="py-2.5 px-2">Mood</th>
                <th className="py-2.5 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.slice().reverse().map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-2 font-mono text-white">
                    {log.dayLabel} <span className="text-[10px] text-slate-500">({log.date})</span>
                    {log.isAutoTracked && (
                      <span className="ml-1.5 px-1 py-0.2 text-[9px] text-[#00F5D4] bg-[#00F5D4]/10 rounded border border-[#00F5D4]/20">
                        Auto
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[#00F5D4]">{log.screenTimeHours}h</td>
                  <td className="py-2.5 px-2 font-mono text-purple-300">{log.socialMediaHours}h</td>
                  <td className="py-2.5 px-2 font-mono text-white">{log.sleepHours}h</td>
                  <td className="py-2.5 px-2 font-mono text-slate-400">{log.studyHours}h</td>
                  <td className="py-2.5 px-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[11px]">
                      {log.mood}/5
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(log)}
                      className="text-xs font-semibold text-[#00F5D4] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-xs font-semibold text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Consent Guardrail Modal */}
      <AutoMonitoringGuardrailModal
        isOpen={isGuardrailOpen}
        onClose={() => setIsGuardrailOpen(false)}
        onConfirmEnable={enableAutoMonitoring}
      />
    </div>
  );
}