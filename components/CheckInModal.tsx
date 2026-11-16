"use client";

import React, { useState } from "react";
import { XIcon, SparklesIcon, CheckCircleIcon, ShieldIcon } from "./Icons";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
  const [step, setStep] = useState(2);
  const [stressScore, setStressScore] = useState(6);
  const [selectedTag, setSelectedTag] = useState("Academic Pressure");
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const tags = [
    "Academic Pressure",
    "Screen Exhaustion",
    "Sleep Irregularity",
    "Social Anxiety",
    "Substance Urges",
    "General Burnout",
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setStep(2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-panel border border-[#00F5D4]/30 shadow-[0_0_50px_rgba(0,245,212,0.18)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow orbs */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#00F5D4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#8A2BE2]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4]">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Confidential Check-in</h3>
              <p className="text-xs text-slate-400">Zero session logs • No login required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {!isCompleted ? (
          <div className="mt-6 space-y-6">
            {/* Step Indicator */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Progress: Step {step} of 4</span>
                <span className="text-[#00F5D4]">{step * 25}% Evaluated</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#00F5D4] to-[#8A2BE2] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,245,212,0.6)]"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>

            {/* Step Questions */}
            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-200">
                  What is placing the heaviest demand on your mental bandwidth today?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                        selectedTag === tag
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-200">
                    Current Internal Stress Scale
                  </label>
                  <span className="text-base font-extrabold text-[#00F5D4] px-2.5 py-0.5 rounded-md bg-[#00F5D4]/10 border border-[#00F5D4]/30">
                    {stressScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressScore}
                  onChange={(e) => setStressScore(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F5D4]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1: Calm / Grounded</span>
                  <span>5: Moderate Tension</span>
                  <span>10: Critical Overload</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <p className="text-sm font-semibold text-purple-200">Non-Judgmental Recommendation</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You noted high tension around <strong className="text-white">{selectedTag}</strong>. Your nervous system would benefit from an intentional 15-minute screen-free decompression before your next work block.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <ShieldIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>Anonymous Session</span>
              </span>
              <div className="flex space-x-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all hover:scale-105"
                >
                  {step === 4 ? "Complete Check-in" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/40 flex items-center justify-center text-[#00F5D4] shadow-[0_0_30px_rgba(0,245,212,0.3)]">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Check-in Logged Safely</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your anonymous entry has been processed into your local session. Remember that taking proactive micro-breaks is a sign of resilience, not weakness.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00F5D4]/30 to-[#8A2BE2]/40 hover:from-[#00F5D4]/40 hover:to-[#8A2BE2]/50 border border-white/20 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
