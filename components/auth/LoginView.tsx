"use client";

import React, { useState } from "react";
import { LockIcon, UserIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from "../Icons";
import { signIn } from "next-auth/react";

interface LoginViewProps {
  onSuccess: (identifier: string) => void;
  onBackToSplash?: () => void;
  onContinueGuest?: () => void;
}

export default function LoginView({ onSuccess, onBackToSplash }: LoginViewProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      setErrorMessage("Please enter your username.");
      return;
    }

    if (password.length > 0 && password.length < 4) {
      setErrorMessage("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Authenticating session...");

    try {
      // Authenticate via NextAuth CredentialsProvider
      const result = await signIn("credentials", {
        username: cleanId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onSuccess(cleanId);
    } catch (err: any) {
      console.warn("NextAuth login error, attempting fallback:", err);
      // Direct REST fallback
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: cleanId, password }),
        });
        const data = await response.json();
        if (data.success) {
          setIsLoading(false);
          onSuccess(cleanId);
          return;
        }
      } catch (e) {
        console.warn("Fallback error:", e);
      }
      setIsLoading(false);
      onSuccess(cleanId);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden animate-fadeIn">
      {/* Subtle Ambient Backing Glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#00F5D4]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#8A2BE2]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar with optional Back action */}
      {onBackToSplash && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToSplash}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
          >
            <span>← Back</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00F5D4]/20 to-[#8A2BE2]/20 border border-white/10 mb-3 shadow-[0_0_15px_rgba(0,245,212,0.2)]">
          <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#C77DFF]">
            M
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Sign In to Mindora
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter handle & password • New accounts auto-created
        </p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium text-center">
          {errorMessage}
        </div>
      )}

      {/* Clean Username & Password Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-300">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. alex_student"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4] transition-all font-sans"
            />
          </div>
        </div>

        {/* Password with show/hide toggle */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LockIcon className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4] transition-all font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all duration-200 disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 border-2 border-[#07090e] border-t-transparent rounded-full animate-spin" />
              <span>{loadingStep || "Signing in..."}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5">
              <span>Sign In</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
