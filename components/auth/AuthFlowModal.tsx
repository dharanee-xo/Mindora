"use client";

import React, { useState } from "react";
import SplashScreen from "./SplashScreen";
import LoginView from "./LoginView";
import { XIcon } from "../Icons";

interface AuthFlowModalProps {
  isOpen: boolean;
  initialView?: "splash" | "login";
  onClose: () => void;
  onLoginSuccess: (userHandle: string) => void;
}

export default function AuthFlowModal({
  isOpen,
  initialView = "login",
  onClose,
  onLoginSuccess,
}: AuthFlowModalProps) {
  const [currentView, setCurrentView] = useState<"splash" | "login">(initialView);

  if (!isOpen) return null;

  const handleAuthSuccess = (userHandle: string) => {
    onLoginSuccess(userHandle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl transition-all duration-500 overflow-y-auto">
      {/* Background Holographic Atmosphere */}
      <div className="fixed top-1/4 left-1/4 w-[450px] h-[450px] bg-[#00F5D4]/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8A2BE2]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Container Frame */}
      <div className="relative w-full max-w-md my-auto">
        {/* Floating Top Close Bar */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onClose}
            title="Close"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher with Smooth Transition */}
        <div className="transition-all duration-500 ease-out">
          {currentView === "splash" ? (
            <SplashScreen
              onGetStarted={() => setCurrentView("login")}
            />
          ) : (
            <LoginView
              onSuccess={handleAuthSuccess}
              onBackToSplash={() => setCurrentView("splash")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
