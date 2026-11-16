"use client";

import React, { useState } from "react";
import { XIcon, LockIcon, ShieldIcon, SearchIcon, CheckCircleIcon } from "./Icons";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentModal({ isOpen, onClose }: IncidentModalProps) {
  const [ticketInput, setTicketInput] = useState("MIN-8842");
  const [activeTab, setActiveTab] = useState<"lookup" | "create">("lookup");
  const [isSearched, setIsSearched] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-[0_0_50px_rgba(138,43,226,0.2)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-[#C77DFF]">
              <ShieldIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Encrypted Incident Tracker</h3>
              <p className="text-xs text-slate-400">Zero IP logging • Cryptographic verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 mt-5 rounded-xl bg-white/[0.04] border border-white/5">
          <button
            onClick={() => setActiveTab("lookup")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "lookup"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Track Existing Ticket
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "create"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            File Anonymous Report
          </button>
        </div>

        {activeTab === "lookup" ? (
          <div className="mt-5 space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="Enter Ticket Code (e.g., MIN-8842)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#C77DFF]"
                />
              </div>
              <button
                onClick={() => setIsSearched(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 shadow-[0_0_15px_rgba(138,43,226,0.4)] flex items-center space-x-1.5"
              >
                <SearchIcon className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>

            {isSearched && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded border border-[#00F5D4]/20">
                    #{ticketInput || "MIN-8842"}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>In Review by Student Advocate</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Category:</strong> Campus Substance & Wellness Concern</p>
                  <p><strong className="text-slate-400">Privacy Status:</strong> Sealed cryptographic hash (Zero IP attached)</p>
                  <p><strong className="text-slate-400">Last Action:</strong> Safe resource guidelines dispatched to ticket inbox.</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Advocate Key: 0x8F9...B24</span>
                  <span className="text-purple-300">Updated 2h ago</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-3 text-xs">
            <label className="block text-slate-300 font-semibold">Incident Type</label>
            <select className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200">
              <option className="bg-[#07090e]">Substance Pressure / Safe Exit Assistance</option>
              <option className="bg-[#07090e]">Severe Academic Mental Health Crisis</option>
              <option className="bg-[#07090e]">Hostile Roommate / Campus Harassment</option>
            </select>
            <label className="block text-slate-300 font-semibold pt-1">Confidential Notes</label>
            <textarea
              rows={3}
              placeholder="Describe what occurred. Do not share names or student IDs if you prefer full anonymity..."
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 placeholder-slate-500"
            />
            <button
              onClick={() => {
                alert("Incident safely submitted! Ticket ID #MIN-9024 generated.");
                setActiveTab("lookup");
              }}
              className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#8A2BE2] to-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.3)] text-xs mt-2"
            >
              Submit Without Identity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
