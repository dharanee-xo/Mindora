"use client";

import React from "react";
import { ShieldIcon, LockIcon, XIcon, CheckCircleIcon } from "../Icons";

interface AutoMonitoringGuardrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEnable: () => void;
}

export default function AutoMonitoringGuardrailModal({
  isOpen,
  onClose,
  onConfirmEnable,
}: AutoMonitoringGuardrailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-fadeIn">
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-[#00F5D4]/40 shadow-[0_0_60px_rgba(0,245,212,0.25)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#00F5D4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#8A2BE2]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4]">
              <ShieldIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Smart Activity Sync Consent</h3>
              <p className="text-xs text-slate-400">Explicit Permission & Privacy Guardrail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Explicit Privacy Guardrail Bullet Points */}
        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-200 leading-relaxed">
            Mindora’s <strong>Smart Activity Sync Mode</strong> uses client-side browser Page Visibility APIs (<code className="text-[#00F5D4] font-mono">document.hidden</code>, window focus/blur) to estimate active study sessions and detect rest pauses. Please review our mandatory privacy guardrails:
          </p>

          <div className="space-y-3">
            {/* Guardrail 1: Zero Remote Cloud Telemetry */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-xs">
              <CheckCircleIcon className="w-4 h-4 text-[#00F5D4] flex-shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <strong className="text-white block font-semibold">Zero Remote Cloud Telemetry:</strong>
                Runs strictly inside the local browser storage. No data is transmitted to external servers, cloud databases, or institutional tracking systems.
              </div>
            </div>

            {/* Guardrail 2: No Keylogging or URL Tracking */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-xs">
              <CheckCircleIcon className="w-4 h-4 text-[#00F5D4] flex-shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <strong className="text-white block font-semibold">No Keylogging or URL Tracking:</strong>
                Does not capture keystrokes, personal messages, browsed URLs, or search history. Only measures whether the tab is actively focused.
              </div>
            </div>

            {/* Guardrail 3: Always Editable & Overridable */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-xs">
              <CheckCircleIcon className="w-4 h-4 text-[#00F5D4] flex-shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <strong className="text-white block font-semibold">Always Editable & Overridable:</strong>
                Users can adjust, override, calibrate, or completely turn off auto-synced values at any time through form inputs or settings.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 text-center"
          >
            Keep in Manual Mode
          </button>

          <button
            onClick={() => {
              onConfirmEnable();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all"
          >
            I Consent & Enable Auto-Sync
          </button>
        </div>
      </div>
    </div>
  );
}
