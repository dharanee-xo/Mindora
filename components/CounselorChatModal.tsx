"use client";

import React, { useState } from "react";
import { XIcon, LockIcon, ShieldIcon, MessageSquareIcon } from "./Icons";

interface CounselorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CounselorChatModal({ isOpen, onClose }: CounselorChatModalProps) {
  const [messages, setMessages] = useState([
    {
      sender: "counselor",
      text: "Hello. I am Counselor Elena (License #MN-304). This channel is end-to-end encrypted with zero logging. You are completely anonymous. How are you feeling right now?",
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      sender: "user",
      text: inputValue,
      time: "Just now",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    // Simulated supportive counselor reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "counselor",
          text: "Thank you for sharing that with me. Academic and life stress can be overwhelming, but you took a courageous step reaching out. Take a deep breath — we can talk through this step-by-step.",
          time: "Just now",
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-xl h-[560px] flex flex-col rounded-2xl glass-panel border border-[#8A2BE2]/40 shadow-[0_0_60px_rgba(138,43,226,0.25)] text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#00F5D4] flex items-center justify-center text-white font-bold text-sm">
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F5D4] border-2 border-[#07090e]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Verified Peer Counselor</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-[#00F5D4] bg-[#00F5D4]/10 rounded-full border border-[#00F5D4]/30">
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <LockIcon className="w-3 h-3 text-[#00F5D4]" />
                <span>Alias: <strong className="text-slate-200">Student #4928</strong> (Identity Hidden)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* E2E Encryption Banner */}
        <div className="py-2 px-4 bg-[#8A2BE2]/10 border-b border-[#8A2BE2]/20 flex items-center justify-center space-x-2 text-center">
          <LockIcon className="w-3.5 h-3.5 text-[#C77DFF]" />
          <p className="text-[11px] text-purple-200 font-medium">
            256-bit Ephemeral Chat • No logs stored • Closes upon tab exit
          </p>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#00F5D4] text-[#07090e] font-medium rounded-br-none shadow-[0_0_15px_rgba(0,245,212,0.3)]"
                    : "glass-pill border border-white/10 text-slate-200 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type confidentially... (Press Enter to send)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4] transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
