"use client";

import React, { useState } from "react";
import { ShieldIcon, XIcon, CheckCircleIcon } from "../Icons";

export default function SupportHelpCentre() {
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"digital" | "addiction" | "emotional" | "counselor">("digital");

  const helplines = [
    {
      name: "Tele-MANAS (NIMHANS / Govt. of India)",
      number: "14416",
      tollFree: "1800-891-4416",
      tag: "24x7 • Toll-Free • 20+ Languages",
      desc: "Official National Tele Mental Health Programme of India providing immediate, free, confidential psychosocial support.",
      highlight: true,
    },
    {
      name: "National Emergency Number",
      number: "112",
      tollFree: "112",
      tag: "24x7 • All Emergency Services",
      desc: "Unified emergency services across India for immediate medical, police, or crisis response.",
      highlight: true,
    },
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      tollFree: "1800-599-0019",
      tag: "24x7 • Govt. of India (MSJE)",
      desc: "Dedicated national relief for acute exam distress, anxiety, panic, and psychological first aid.",
      highlight: false,
    },
    {
      name: "Vandrevala Foundation Helpline",
      number: "+91 9999 666 555",
      tollFree: "9999 666 555",
      tag: "24x7 • Free Counseling",
      desc: "Experienced clinical psychologists and counselors for student emotional wellness and burnout.",
      highlight: false,
    },
  ];

  const categories = [
    {
      id: "digital",
      title: "Digital Wellbeing & Detox",
      points: [
        "Create 'No-Phone Zones' during meals and 45 minutes before sleep.",
        "Turn mobile displays to Greyscale to eliminate dopamine-triggering bright colors.",
        "Keep leisure scrolling completely distinct from academic study sessions.",
        "Practice the 20-20-20 rule to relieve ocular tension and headache cycles.",
      ],
    },
    {
      id: "addiction",
      title: "Addiction Awareness & Harm Prevention",
      points: [
        "Notice triggers: are you scrolling or gaming out of boredom, fatigue, or emotional avoidance?",
        "Replace urges with tangible substitutes: a cold glass of water, 10 deep breaths, or an outdoor walk.",
        "Recovery is non-linear. Mindora never shames students for missed days or habit slips.",
        "Connect anonymously with campus student counselors if compulsive habits interfere with life.",
      ],
    },
    {
      id: "emotional",
      title: "Exam Stress & Emotional Health",
      points: [
        "Your intrinsic worth is entirely separate from exam grades or placement rankings.",
        "When panic surges, practice 4-7-8 box breathing or 5-4-3-2-1 sensory grounding.",
        "Schedule intentional rest as a mandatory daily event, not an afterthought.",
        "Talk to friends or peer listeners — vulnerability builds connection and dissolves isolation.",
      ],
    },
    {
      id: "counselor",
      title: "Professional Counselor Guidance",
      points: [
        "Therapy is proactive cognitive conditioning, never an admission of weakness.",
        "Tele-MANAS (14416) provides completely free, confidential guidance with clinical psychologists.",
        "Campus counseling centers offer formal accommodations for students experiencing acute stress.",
        "Everything shared with licensed practitioners is legally protected under strict medical privacy.",
      ],
    },
  ];

  const currentTrack = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. GET HELP NOW BANNER */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#8A2BE2]/15 to-[#00F5D4]/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glass">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
              24x7 Immediate Support
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            Need Someone to Talk to Right Now?
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Free, confidential, toll-free Indian mental health helplines available 24 hours a day.
          </p>
        </div>

        <button
          onClick={() => setIsCrisisModalOpen(true)}
          className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <span>Get Help Now (14416 / 112)</span>
        </button>
      </div>

      {/* 2. VERIFIED INDIAN HELPLINES GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold text-white">
            Verified Indian National Helplines
          </h4>
          <span className="text-xs font-mono text-slate-400">
            Government of India
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {helplines.map((line, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl glass-panel-interactive border transition-all flex flex-col justify-between ${
                line.highlight
                  ? "border-[#00F5D4]/40 bg-gradient-to-br from-[#00F5D4]/[0.05] to-transparent"
                  : "border-white/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-bold text-white text-xs sm:text-sm">{line.name}</h5>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {line.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{line.desc}</p>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Dial:</span>
                  <span className="text-base font-extrabold font-mono text-white">
                    {line.number}
                  </span>
                </div>
                <a
                  href={`tel:${line.number.replace(/\s+/g, "")}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-sm transition-all"
                >
                  Call Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STUDENT WELLNESS RESOURCE TRACKS */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 shadow-glass space-y-4">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white">Wellness Resource Tracks</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Practical strategies for digital balance and academic pressure.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id as any)}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeCategory === c.id
                  ? "bg-[#8A2BE2]/20 border-[#C77DFF] text-white font-bold"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <h5 className="text-xs font-semibold">{c.title}</h5>
            </button>
          ))}
        </div>

        {/* Selected Category Content */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <ul className="space-y-2 text-xs text-slate-300">
            {currentTrack.points.map((pt, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#00F5D4] font-bold mt-0.5">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Crisis Modal */}
      {isCrisisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c1017] border border-rose-500/40 shadow-2xl relative">
            <button
              onClick={() => setIsCrisisModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Emergency Crisis Dispatch
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Immediate Help Available
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              If you or someone you know is in immediate distress, please call one of the toll-free services below:
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:14416"
                className="w-full p-3.5 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-left block transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Tele-MANAS (Mental Health)</span>
                  <span className="text-sm font-mono font-bold text-rose-300">14416</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Toll-Free • 24x7 • Govt. of India</span>
              </a>

              <a
                href="tel:112"
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-left block transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">National Emergency</span>
                  <span className="text-sm font-mono font-bold text-[#00F5D4]">112</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Police / Medical / Ambulance</span>
              </a>

              <a
                href="tel:18005990019"
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-left block transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">KIRAN Helpline</span>
                  <span className="text-sm font-mono font-bold text-purple-300">1800-599-0019</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">MSJE Psychological Relief</span>
              </a>
            </div>

            <button
              onClick={() => setIsCrisisModalOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 transition-all text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}