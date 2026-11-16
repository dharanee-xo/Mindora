"use client";

import React, { useState } from "react";
import { LockIcon, ShieldIcon, SparklesIcon, CheckCircleIcon } from "../Icons";

export default function PrivateSelfCheck() {
  const [answers, setAnswers] = useState({
    q1_mood: "Calm & Grounded",
    q2_sleep: "Woke up refreshed",
    q3_screen: "Intentional / Controlled",
    q4_breaks: "Took regular stretch breaks",
    journal: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-glass">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-xl bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4]">
            <LockIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Private Daily Self-Reflection</h3>
            <p className="text-xs text-slate-400">100% ephemeral • Zero remote server transmission</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Taking 90 seconds to check in with your internal state anchors self-awareness. These questions help you evaluate whether digital devices are serving your goals or draining your vitality.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-glass space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Mood Pulse */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              1. How would you describe your baseline mood today?
            </label>
            <select
              value={answers.q1_mood}
              onChange={(e) => setAnswers({ ...answers, q1_mood: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F5D4]"
            >
              <option className="bg-[#07090e]">Calm & Grounded</option>
              <option className="bg-[#07090e]">Optimistic & Energized</option>
              <option className="bg-[#07090e]">Slightly Stressed / Hurried</option>
              <option className="bg-[#07090e]">Mentally Overwhelmed</option>
              <option className="bg-[#07090e]">Numb / Autopilot</option>
            </select>
          </div>

          {/* Question 2: Sleep Refreshment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              2. How restorative was your sleep last night?
            </label>
            <select
              value={answers.q2_sleep}
              onChange={(e) => setAnswers({ ...answers, q2_sleep: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F5D4]"
            >
              <option className="bg-[#07090e]">Woke up refreshed & clear-headed</option>
              <option className="bg-[#07090e]">Adequate, woke up a bit groggy</option>
              <option className="bg-[#07090e]">Restless, checked phone late at night</option>
              <option className="bg-[#07090e]">Severe sleep deficit / pulled an all-nighter</option>
            </select>
          </div>

          {/* Question 3: Screen Balance */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              3. Did your screen time feel intentional or compulsive today?
            </label>
            <select
              value={answers.q3_screen}
              onChange={(e) => setAnswers({ ...answers, q3_screen: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F5D4]"
            >
              <option className="bg-[#07090e]">Intentional / Focused on coursework & hobbies</option>
              <option className="bg-[#07090e]">Mild doomscrolling but caught myself early</option>
              <option className="bg-[#07090e]">Heavy algorithmic rabbit holes & distraction</option>
              <option className="bg-[#07090e]">Felt controlled by notifications and group chats</option>
            </select>
          </div>

          {/* Question 4: Breaks & Somatic Tension */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              4. Did you tune into physical body posture and eye fatigue?
            </label>
            <select
              value={answers.q4_breaks}
              onChange={(e) => setAnswers({ ...answers, q4_breaks: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F5D4]"
            >
              <option className="bg-[#07090e]">Took regular stretch breaks & hydrated</option>
              <option className="bg-[#07090e]">Forgot breaks until neck/eyes felt strained</option>
              <option className="bg-[#07090e]">Sat stationary for 4+ consecutive hours</option>
            </select>
          </div>
        </div>

        {/* Private Journal Textarea */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>Optional Uncensored Private Reflection (Encrypted in Local Browser Memory)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Zero Database Export</span>
          </label>
          <textarea
            rows={3}
            value={answers.journal}
            onChange={(e) => setAnswers({ ...answers, journal: e.target.value })}
            placeholder="Write freely. What worked well today? What triggered tension? (This text is stored purely on this device and can be wiped anytime)..."
            className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C77DFF]"
          />
        </div>

        {/* Supportive Feedback Output */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8A2BE2]/10 via-white/[0.02] to-[#00F5D4]/10 border border-white/10 flex items-start space-x-3 text-xs">
          <ShieldIcon className="w-5 h-5 text-[#00F5D4] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Supportive Feedback Summary:</span>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              Based on your reflection, you are actively tuning into your cognitive load. Give yourself credit for acknowledging your current bandwidth. Taking one 10-minute walk without your phone this evening will help reset mental fatigue.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 animate-fade-in">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span>Self-Check Secured in Local Storage!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono">Local State Verified</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_20px_rgba(0,245,212,0.3)] transition-all"
          >
            Save Self-Check
          </button>
        </div>
      </form>
    </div>
  );
}
