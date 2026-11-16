"use client";

import React from "react";

export default function Futuristic3DLogo({ size = 120 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Dynamic Ambient Blur Glow behind logo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F5D4]/40 via-[#8A2BE2]/40 to-[#00F5D4]/20 blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full bg-[#8A2BE2]/25 blur-3xl -z-10" />

      {/* SVG 3D-Styled Holographic Wellness Emblem */}
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(0,245,212,0.4)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="neonTealToPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="50%" stopColor="#48CAE4" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>

          <linearGradient id="purpleGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C77DFF" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="shieldPlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(7,9,14,0.85)" />
          </linearGradient>

          <filter id="hologramGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbital Rotating Ring */}
        <circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="url(#neonTealToPurple)"
          strokeWidth="1.5"
          strokeDasharray="6 8 18 8"
          className="opacity-70 animate-[spin_20s_linear_infinite]"
        />

        {/* Secondary Concentric Ring */}
        <circle
          cx="80"
          cy="80"
          r="62"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
        />

        {/* 3D Glassmorphic Hexagonal Shield Base */}
        <polygon
          points="80,24 126,48 126,104 80,136 34,104 34,48"
          fill="url(#shieldPlate)"
          stroke="url(#neonTealToPurple)"
          strokeWidth="2.5"
          className="backdrop-blur-md"
        />

        {/* Inner Wellness Lotus Petals / Bio-Synapse Curves (Representing Balance & Mind) */}
        {/* Left Wing / Petal */}
        <path
          d="M80 50 C60 65, 45 85, 52 105 C60 115, 75 110, 80 85"
          fill="url(#purpleGlow)"
          opacity="0.85"
        />

        {/* Right Wing / Petal */}
        <path
          d="M80 50 C100 65, 115 85, 108 105 C100 115, 85 110, 80 85"
          fill="url(#neonTealToPurple)"
          opacity="0.85"
        />

        {/* Central Core Sphere (Sanctuary / Privacy Beacon) */}
        <circle
          cx="80"
          cy="80"
          r="14"
          fill="#07090e"
          stroke="#00F5D4"
          strokeWidth="3"
          filter="url(#hologramGlow)"
        />

        {/* Core Glowing Dot */}
        <circle
          cx="80"
          cy="80"
          r="6"
          fill="#00F5D4"
          className="animate-pulse"
        />

        {/* 3D Highlight Glint Points */}
        <circle cx="48" cy="56" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="112" cy="56" r="2" fill="#00F5D4" opacity="0.8" />
        <circle cx="80" cy="130" r="2.5" fill="#8A2BE2" opacity="0.9" />
      </svg>
    </div>
  );
}
