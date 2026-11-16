"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import AnonymousAssessmentCard from "@/components/AnonymousAssessmentCard";
import HabitTrackerCard from "@/components/HabitTrackerCard";
import SupportHubCard from "@/components/SupportHubCard";
import WellbeingSection from "@/components/wellbeing/WellbeingSection";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/auth/SplashScreen";
import LoginView from "@/components/auth/LoginView";
import TopMoodCheckInBar from "@/components/wellbeing/TopMoodCheckInBar";
import TopMonitoringToggleBar from "@/components/wellbeing/TopMonitoringToggleBar";
import { WellbeingProvider } from "@/context/WellbeingContext";
import { ArrowRightIcon } from "@/components/Icons";

export default function Home() {
  // App Entry Flow: splash -> login -> dashboard
  const [rootFlowState, setRootFlowState] = useState<"splash" | "login" | "dashboard">("splash");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // 60-second breathing state
  const [breatheState, setBreatheState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Active sub-tab in the 8-module wellbeing section
  const [activeWellbeingTab, setActiveWellbeingTab] = useState<string>("dashboard");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mindora_active_user");
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    } catch (e) {
      console.warn("Storage check:", e);
    }
  }, []);

  const handleLoginSuccess = (identifier: string) => {
    setCurrentUser(identifier);
    try {
      localStorage.setItem("mindora_active_user", identifier);
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    setRootFlowState("dashboard");
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("mindora_active_user");
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
    setRootFlowState("login");
  };

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setIsBreathingActive(true);
      setBreatheState("Inhale");
      let count = 0;
      const interval = setInterval(() => {
        count = (count + 1) % 3;
        if (count === 0) setBreatheState("Inhale");
        else if (count === 1) setBreatheState("Hold");
        else setBreatheState("Exhale");
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setIsBreathingActive(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // 1. SPLASH SCREEN (2.2s auto-transition or Get Started)
  // ══════════════════════════════════════════════════════════════════
  if (rootFlowState === "splash") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-slate-100 overflow-hidden px-4 selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
        {/* Ambient Glows */}
        <div className="fixed top-[-10%] left-[25%] w-[500px] h-[500px] bg-[#00F5D4]/12 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[20%] w-[550px] h-[550px] bg-[#8A2BE2]/18 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="w-full max-w-md my-auto">
          <SplashScreen
            onGetStarted={() => setRootFlowState("login")}
          />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. MINIMALIST APP-STYLE LOGIN VIEW (Real Google OAuth & Credentials)
  // ══════════════════════════════════════════════════════════════════
  if (rootFlowState === "login") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#07090e] text-slate-100 overflow-hidden px-4 py-8 selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
        {/* Soft Ambient Glows */}
        <div className="fixed top-[-10%] left-[25%] w-[500px] h-[500px] bg-[#00F5D4]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[20%] w-[550px] h-[550px] bg-[#8A2BE2]/15 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="w-full max-w-sm flex items-center justify-between py-2">
          <button
            onClick={() => setRootFlowState("splash")}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Splash
          </button>
        </div>

        {/* Minimal Center Login Card */}
        <main className="my-auto w-full max-w-sm">
          <LoginView
            onSuccess={handleLoginSuccess}
            onBackToSplash={() => setRootFlowState("splash")}
          />
        </main>

        {/* Minimal Footer */}
        <footer className="w-full max-w-sm text-center py-2 text-[11px] text-slate-500">
          <span>Mindora • Student Mental Wellbeing & Balance</span>
        </footer>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 3. UNCLUTTERED APP-STYLE DASHBOARD WITH TOP CONTROLS
  // ══════════════════════════════════════════════════════════════════
  return (
    <WellbeingProvider>
      <div className="relative min-h-screen flex flex-col bg-[#07090e] text-slate-100 overflow-x-hidden selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
        {/* Ambient Background Glows */}
        <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#00F5D4]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[15%] right-[10%] w-[600px] h-[600px] bg-[#8A2BE2]/15 rounded-full blur-[160px] pointer-events-none -z-10" />

        {/* Header */}
        <Header
          currentUser={currentUser}
          onSelectTab={(tabId) => setActiveWellbeingTab(tabId)}
          onSignOut={handleSignOut}
          onOpenAuth={() => setRootFlowState("login")}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
          {/* SECTION 1: HERO OVERVIEW */}
          <section className="text-center max-w-2xl mx-auto pt-2 pb-1 space-y-3.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Reclaim Your Focus. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#C77DFF]">
                Restore Your Peace.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              A confidential digital wellness space designed for students to build balanced habits, track screen time, and access verified support.
            </p>

            {/* Quick Actions */}
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setActiveWellbeingTab("monitoring");
                  const el = document.getElementById("digital-wellbeing-module");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all flex items-center space-x-1.5"
              >
                <span>Log Daily Activity</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>

              <a
                href="tel:14416"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-1.5"
              >
                <span>Helpline: 14416</span>
              </a>
            </div>
          </section>

          {/* TOP QUICK-ACTION CONTROLS: MOOD CHECK-IN & AUTO/MANUAL TOGGLE */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Daily Mood Check-in Bar */}
            <TopMoodCheckInBar />

            {/* Top-Level Auto / Manual Monitoring Switcher */}
            <TopMonitoringToggleBar />
          </section>

          {/* SECTION 2: CORE 3 INTERACTIVE MODULE CARDS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Core Modules
                </h2>
                <p className="text-xs text-slate-400">
                  Self-assessment, habit tracking, and confidential counseling.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {/* Module 01: Anonymous Self-Assessment */}
              <AnonymousAssessmentCard />

              {/* Module 02: Digital Detox & Habit Tracker */}
              <HabitTrackerCard />

              {/* Module 03: Secure Support Hub */}
              <SupportHubCard />
            </div>
          </section>

          {/* SECTION 3: INTEGRATED WELLBEING ECOSYSTEM (All 8 Modules) */}
          <WellbeingSection
            activeTab={activeWellbeingTab}
            onTabChange={(tabId) => setActiveWellbeingTab(tabId)}
          />

          {/* SECTION 4: 60-SECOND MINDFUL GROUNDING BAR */}
          <section className="rounded-2xl p-5 sm:p-6 glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glass">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  60-Second Grounding Pause
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Feeling tense or overloaded? Reset with a synchronized breathing interval.
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              {isBreathingActive && (
                <div className="px-3.5 py-1.5 rounded-xl bg-[#00F5D4]/15 border border-[#00F5D4]/40 text-[#00F5D4] font-mono font-bold text-xs animate-pulse">
                  {breatheState}...
                </div>
              )}
              <button
                onClick={toggleBreathing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-[#00F5D4]/40 transition-all shadow-sm"
              >
                {isBreathingActive ? "Stop" : "Begin Mindful Breath"}
              </button>
            </div>
          </section>
        </main>

        {/* SECTION 5: FOOTER */}
        <Footer />
      </div>
    </WellbeingProvider>
  );
}
