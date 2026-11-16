"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import AutoMonitoringGuardrailModal from "./AutoMonitoringGuardrailModal";
import LiveSessionHUD from "./LiveSessionHUD";

interface TopMonitoringToggleBarProps {
  onSyncValues?: (screenHours: number, breaks: number) => void;
}

export default function TopMonitoringToggleBar({ onSyncValues }: TopMonitoringToggleBarProps) {
  const {
    isAutoMonitoringEnabled,
    isPermissionGranted,
    enableAutoMonitoring,
    disableAutoMonitoring,
  } = useWellbeing();

  const [isGuardrailOpen, setIsGuardrailOpen] = useState(false);

  const handleToggle = () => {
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

  return (
    <div className="w-full space-y-4">
      {/* Top Bar Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span
            className={`w-3 h-3 rounded-full flex-shrink-0 ${
              isAutoMonitoringEnabled
                ? "bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"
                : "bg-slate-500"
            }`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Activity Tracking Mode
              </h3>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                  isAutoMonitoringEnabled
                    ? "bg-[#00F5D4]/15 border-[#00F5D4]/40 text-[#00F5D4]"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {isAutoMonitoringEnabled ? "Auto-Sync ON" : "Manual Mode"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAutoMonitoringEnabled
                ? "Tracking local study session and screen pauses automatically via browser events."
                : "Manual voluntary logging active. Zero background browser telemetry running."}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center space-x-3 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto flex-shrink-0">
          <span className="text-xs font-semibold text-slate-300">
            {isAutoMonitoringEnabled ? "Auto-Sync" : "Manual"}
          </span>

          <button
            type="button"
            onClick={handleToggle}
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

      {/* Live Session HUD when Auto mode is enabled */}
      {isAutoMonitoringEnabled && (
        <div className="animate-fadeIn">
          <LiveSessionHUD onSyncValues={onSyncValues} />
        </div>
      )}

      {/* Mandatory Consent Guardrail Modal */}
      <AutoMonitoringGuardrailModal
        isOpen={isGuardrailOpen}
        onClose={() => setIsGuardrailOpen(false)}
        onConfirmEnable={enableAutoMonitoring}
      />
    </div>
  );
}
