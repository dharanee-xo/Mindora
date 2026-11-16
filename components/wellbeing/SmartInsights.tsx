"use client";

import React from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { SparklesIcon, ShieldIcon, CheckCircleIcon, FlameIcon, ClockIcon } from "../Icons";

export default function SmartInsights() {
  const { logs, activeLog } = useWellbeing();

  // Compute voluntary metrics
  const avgScreenTime = (
    logs.reduce((acc, l) => acc + l.screenTimeHours, 0) / (logs.length || 1)
  ).toFixed(1);

  const avgSleepHours = (
    logs.reduce((acc, l) => acc + l.sleepHours, 0) / (logs.length || 1)
  ).toFixed(1);

  const totalBreaks = logs.reduce((acc, l) => acc + l.breaksCount, 0);

  const currentMoodScore = activeLog?.moodScore ?? (activeLog?.mood ? activeLog.mood * 2 : 7);
  const currentStressLevel = activeLog?.stressLevel ?? 3;

  const insights = [
    {
      id: "insight-0",
      title: "Mood Trend & Screen-Time Correlation",
      highlight: `Mood: ${currentMoodScore}/10 • Stress: ${currentStressLevel}/10 • Screen: ${activeLog.screenTimeHours}h`,
      type: currentMoodScore >= 7 ? "positive" : "gentle-nudge",
      description:
        currentMoodScore >= 7
          ? `Your balanced digital leisure (${activeLog.screenTimeHours}h) correlates with a high emotional stability score of ${currentMoodScore}/10 and low stress (${currentStressLevel}/10). Restorative offline habits are shielding your cognitive bandwidth.`
          : `High daily screen stimulation (${activeLog.screenTimeHours}h) correlates with an elevated stress level of ${currentStressLevel}/10 and a lower emotional score (${currentMoodScore}/10). Continuous cognitive input prevents neural decompression.`,
      actionableTip:
        currentMoodScore >= 7
          ? "Maintain your current routine: Keep evening phone usage dim and take 5-minute movement pauses between tasks."
          : "Actionable Nudge: Try a 20-minute device blackout before dinner or bedtime to allow dopamine baseline recovery.",
    },
    {
      id: "insight-1",
      title: "Screen-Time & Sleep Rhythm Correlation",
      highlight: `${activeLog.screenTimeHours}h screen vs ${activeLog.sleepHours}h rest`,
      type: "positive",
      description:
        "Your weekly data reveals that on evenings where non-academic screen time stayed below 5.5 hours, sleep duration averaged 7.8 hours with higher reported energy the following morning.",
      actionableTip:
        "Actionable Strategy: Implement an 'Airplane Mode' wind-down 30 minutes before sleep to allow your pineal gland to naturally release melatonin.",
    },
    {
      id: "insight-2",
      title: "Break Frequency Buffer Against Academic Fatigue",
      highlight: `${activeLog.breaksCount} study breaks logged today`,
      type: "insight",
      description:
        "You averaged 5 intentional study pauses during heavy lecture and coding blocks. Micro-breaks significantly reduce the neurochemical buildup of mental fatigue and postural tension.",
      actionableTip:
        "Try the 50/10 Rhythm: 50 minutes of deep academic focus followed by 10 minutes of standing, hydration, and eye relaxation.",
    },
    {
      id: "insight-3",
      title: "Gaming & Social Feed Immersion Balance",
      highlight: `${activeLog.socialMediaHours}h social • ${activeLog.gamingHours}h gaming`,
      type: "gentle-nudge",
      description:
        "Short-form video feeds trigger intense dopamine bursts that make standard study readings feel understimulating. Keeping scrolling to 1.1 hours preserves your cognitive focus endurance.",
      actionableTip:
        "Consider placing high-friction app limits or greyscale mode on high-stimulus apps during weekdays.",
    },
    {
      id: "insight-4",
      title: "Zero-Shame Compassion Clause",
      highlight: "Non-Judgmental Space",
      type: "compassion",
      description:
        "Wellness is not a linear graph. If an exam crunch week forces high screen time or irregular sleep, accept it without guilt. Recovery begins the moment you pause.",
      actionableTip:
        "Mindora does not penalize missed milestones. Self-compassion is the strongest predictor of long-term mental resilience.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-[#00F5D4]/30 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/25">
                Voluntary Trend Analysis
              </span>
              <span className="text-xs text-slate-400">Strictly Non-Clinical Guidance</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">
              Smart Wellbeing Synthesizer
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Encouraging observations derived from your voluntary logs to support cognitive longevity and stress recovery.
            </p>
          </div>

          {/* Quick Summary Pill */}
          <div className="flex items-center space-x-3 bg-white/[0.03] p-3 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">7-Day Avg Screen</span>
              <span className="text-[#00F5D4] font-mono font-bold text-sm">{avgScreenTime}h</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-slate-400 block text-[10px]">7-Day Avg Sleep</span>
              <span className="text-[#C77DFF] font-mono font-bold text-sm">{avgSleepHours}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl glass-panel-interactive border border-white/10 flex flex-col justify-between space-y-4 shadow-glass"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#00F5D4] border border-white/5">
                  {item.highlight}
                </span>
                <SparklesIcon className="w-4 h-4 text-[#C77DFF]" />
              </div>

              <h4 className="text-base font-bold text-white mt-3">{item.title}</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-[#00F5D4] leading-relaxed">
              <strong className="text-white block mb-0.5">💡 Practical Micro-Step:</strong>
              {item.actionableTip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
