"use client";

import React, { useState } from "react";
import WellbeingDashboard from "./WellbeingDashboard";
import DailyMonitoringSystem from "./DailyMonitoringSystem";
import HabitTracker from "./HabitTracker";
import SmartInsights from "./SmartInsights";
import SupportHelpCentre from "./SupportHelpCentre";
import PrivateSelfCheck from "./PrivateSelfCheck";
import RemindersModule from "./RemindersModule";
import PrivacyControls from "./PrivacyControls";

interface WellbeingSectionProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function WellbeingSection({ activeTab: externalTab, onTabChange }: WellbeingSectionProps) {
  const [internalTab, setInternalTab] = useState<string>("dashboard");

  const activeTab = externalTab || internalTab;
  const setActiveTab = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  const tabs = [
    { id: "dashboard", label: "Overview", icon: "📊" },
    { id: "monitoring", label: "Daily Log & Auto-Sync", icon: "📝" },
    { id: "habits", label: "Habits", icon: "✅" },
    { id: "insights", label: "Insights", icon: "💡" },
    { id: "selfcheck", label: "Self-Check", icon: "🧘" },
    { id: "reminders", label: "Nudges", icon: "🔔" },
    { id: "support", label: "Support & Help", icon: "🆘", isCrisis: true },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ];

  return (
    <section id="digital-wellbeing-module" className="space-y-6 scroll-mt-24">
      {/* Clean Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Digital Wellbeing Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized dashboard, voluntary activity tracking, habits, and student support.
          </p>
        </div>

        {/* Tele-MANAS Emergency Hotline Pill */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <a
            href="tel:14416"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600/90 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex items-center space-x-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Tele-MANAS: 14416</span>
          </a>
        </div>
      </div>

      {/* Clean App-Style Tabs Bar */}
      <div className="flex items-center overflow-x-auto pb-2 scrollbar-none gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 border ${
              activeTab === tab.id
                ? tab.isCrisis
                  ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                  : "bg-gradient-to-r from-[#00F5D4]/20 to-[#8A2BE2]/20 border-[#00F5D4]/60 text-[#00F5D4]"
                : "bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:border-white/15"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Tab Panel */}
      <div className="transition-all duration-200">
        {activeTab === "dashboard" && (
          <WellbeingDashboard onNavigateTab={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === "monitoring" && <DailyMonitoringSystem />}
        {activeTab === "habits" && <HabitTracker />}
        {activeTab === "insights" && <SmartInsights />}
        {activeTab === "selfcheck" && <PrivateSelfCheck />}
        {activeTab === "reminders" && <RemindersModule />}
        {activeTab === "support" && <SupportHelpCentre />}
        {activeTab === "privacy" && <PrivacyControls />}
      </div>
    </section>
  );
}