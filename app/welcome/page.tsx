"use client";

import React, { useState } from "react";
import SplashScreen from "@/components/auth/SplashScreen";
import LoginView from "@/components/auth/LoginView";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"splash" | "login">("splash");

  const handleAuthSuccess = (identifier: string) => {
    try {
      localStorage.setItem("mindora_active_user", identifier);
    } catch (e) {
      console.warn("Storage error:", e);
    }
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-slate-100 overflow-hidden px-4 selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[25%] w-[500px] h-[500px] bg-[#00F5D4]/12 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="fixed bottom-[-10%] right-[20%] w-[550px] h-[550px] bg-[#8A2BE2]/18 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Center Dynamic View */}
      <main className="my-auto w-full max-w-md py-6">
        {currentView === "splash" ? (
          <SplashScreen onGetStarted={() => setCurrentView("login")} />
        ) : (
          <LoginView
            onSuccess={handleAuthSuccess}
            onBackToSplash={() => setCurrentView("splash")}
          />
        )}
      </main>
    </div>
  );
}
