"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { ClockIcon, SparklesIcon, CheckCircleIcon, ShieldIcon } from "../Icons";

export default function RemindersModule() {
  const { reminders, toggleReminder, updateReminderFrequency } = useWellbeing();
  const [notificationStatus, setNotificationStatus] = useState<string>("default");
  const [testAlertTriggered, setTestAlertTriggered] = useState(false);

  const requestBrowserPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationStatus(permission);
        if (permission === "granted") {
          new Notification("Mindora Wellness Ping", {
            body: "Gentle reminder: Look 20 feet away for 20 seconds to ease eye strain.",
            icon: "/favicon.ico",
          });
        }
      } catch (err) {
        console.warn("Notification request error:", err);
      }
    } else {
      setNotificationStatus("unsupported");
    }
  };

  const triggerTestInAppPing = () => {
    setTestAlertTriggered(true);
    setTimeout(() => setTestAlertTriggered(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Permission Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#C77DFF] bg-[#8A2BE2]/15 border border-[#8A2BE2]/30">
                Gentle Cognitive Nudges
              </span>
              <span className="text-xs text-slate-400">Strictly Permission-Based</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Wellness Reminders & Screen Nudges
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Opt-in reminders to break prolonged study trance, encourage hydration, and enforce evening wind-down rituals.
            </p>
          </div>

          {/* Browser Permission Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={requestBrowserPermission}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8A2BE2] to-[#9D4EDD] hover:from-[#8A2BE2]/90 hover:to-[#9D4EDD]/90 shadow-[0_0_20px_rgba(138,43,226,0.3)] transition-all flex items-center justify-center space-x-2"
            >
              <ClockIcon className="w-4 h-4 text-[#00F5D4]" />
              <span>
                {notificationStatus === "granted"
                  ? "Notifications Enabled ✓"
                  : "Enable Browser Pings"}
              </span>
            </button>

            <button
              onClick={triggerTestInAppPing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center"
            >
              Test In-App Nudge
            </button>
          </div>
        </div>

        {/* In-App Test Ping Banner */}
        {testAlertTriggered && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#00F5D4]/20 to-[#8A2BE2]/20 border border-[#00F5D4]/40 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-3 text-xs">
              <SparklesIcon className="w-5 h-5 text-[#00F5D4]" />
              <div>
                <strong className="text-white block font-semibold">20-20-20 Screen Pause Nudge:</strong>
                <span className="text-slate-300">
                  Relax your gaze. Look at an object 20 feet away for 20 seconds. Take a slow deep breath.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#00F5D4] bg-black/40 px-2 py-1 rounded">
              Active Now
            </span>
          </div>
        )}
      </div>

      {/* Reminder Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-6 rounded-3xl glass-panel-interactive border transition-all flex flex-col justify-between space-y-4 shadow-glass ${
              rem.enabled
                ? "border-[#00F5D4]/30 bg-gradient-to-br from-[#00F5D4]/[0.05] via-white/[0.02] to-transparent"
                : "border-white/10 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#00F5D4]">
                  {rem.frequency}
                </span>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleReminder(rem.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rem.enabled ? "bg-[#00F5D4]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#07090e] shadow-lg ring-0 transition duration-200 ease-in-out ${
                      rem.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <h4 className="text-base font-bold text-white">{rem.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {rem.description}
              </p>
            </div>

            {/* Custom Interval Dropdown */}
            <div className="pt-3 border-t border-white/5 space-y-1.5">
              <label className="text-[11px] text-slate-400 font-mono block">Custom Cadence:</label>
              <select
                value={rem.frequency}
                onChange={(e) => updateReminderFrequency(rem.id, e.target.value)}
                disabled={!rem.enabled}
                className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 disabled:opacity-50"
              >
                <option className="bg-[#07090e]">Every 30 mins</option>
                <option className="bg-[#07090e]">Every 50 mins</option>
                <option className="bg-[#07090e]">Every 90 mins</option>
                <option className="bg-[#07090e]">Daily at 10:30 PM</option>
                <option className="bg-[#07090e]">Daily at 2:00 PM</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
