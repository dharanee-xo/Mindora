"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { ShieldIcon, LockIcon, XIcon, CheckCircleIcon } from "../Icons";

export default function PrivacyControls() {
  const {
    logs,
    habits,
    isAutoMonitoringEnabled,
    isPermissionGranted,
    enableAutoMonitoring,
    disableAutoMonitoring,
    clearAllData,
    resetToDemoData,
  } = useWellbeing();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const handleConfirmClear = () => {
    clearAllData();
    setShowConfirmModal(false);
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Privacy Pledge Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#00F5D4]/30 shadow-glass">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#00F5D4]/10 border border-[#00F5D4]/25 text-[#00F5D4]">
            <ShieldIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Privacy Architecture & Data Sovereignty</h3>
            <p className="text-xs text-slate-400">Your mental wellness records belong exclusively to you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <LockIcon className="w-4 h-4 text-[#00F5D4]" />
              <span>Zero PII Collection</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mindora never asks for your legal name, university roll number, email address, or device IMEI.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <ShieldIcon className="w-4 h-4 text-[#C77DFF]" />
              <span>Client-Side Local Sandbox</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All daily logs, habit ticks, and private reflection notes exist strictly inside your local browser memory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span>No Cross-Site Ad Trackers</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero third-party analytics pixels, behavioral tracking cookies, or commercial data broker syndication.
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Monitoring Permissions Management */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-white">Smart Activity Sync Permission</h4>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isAutoMonitoringEnabled
                  ? "bg-[#00F5D4]/10 border-[#00F5D4]/30 text-[#00F5D4]"
                  : "bg-white/10 border-white/20 text-slate-400"
              }`}
            >
              {isAutoMonitoringEnabled ? "Permission Active" : "Disabled / Manual Only"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
            Controls whether Mindora uses local browser visibility APIs to detect active study intervals. Can be disabled or revoked instantly without affecting saved history.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isAutoMonitoringEnabled ? (
            <button
              onClick={disableAutoMonitoring}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
            >
              Revoke & Turn Off Auto-Sync
            </button>
          ) : (
            <button
              onClick={enableAutoMonitoring}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all"
            >
              Enable Smart Auto-Sync
            </button>
          )}
        </div>
      </div>

      {/* User Data Controls */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h4 className="text-base font-bold text-white">Local Data Storage Controls</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
            Currently storing <strong className="text-white">{logs.length} daily logs</strong> and{" "}
            <strong className="text-white">{habits.filter((h) => h.completed).length} active habit states</strong> on this device. You can purge everything instantly with zero residual footprint.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={resetToDemoData}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center"
          >
            Reset Demo Data
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600/80 hover:bg-rose-600 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all text-center"
          >
            Purge All Data (MongoDB & Local)
          </button>
        </div>
      </div>

      {isCleared && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fadeIn">
          All student activity logs, habit streaks, and reflections have been permanently purged from MongoDB and local storage.
        </div>
      )}

      {/* Double Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-rose-500/40 text-left shadow-2xl">
            <h4 className="text-base font-bold text-white">Permanently Purge All Database Records?</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This will permanently delete all daily screen-time logs, sleep records, habit history, and private notes from MongoDB and your local device. This action cannot be reversed.
            </p>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
