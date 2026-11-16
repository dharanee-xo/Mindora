"use client";

import React, { useState } from "react";
import { DailyLog } from "@/types/wellbeing";

interface WellbeingChartsProps {
  logs: DailyLog[];
}

export default function WellbeingCharts({ logs }: WellbeingChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<"screenVsSleep" | "screenBreakdown">("screenVsSleep");

  // Safety fallback if logs are empty
  const displayLogs = logs.length > 0 ? logs.slice(-7) : [];

  if (displayLogs.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl text-slate-400">
        No log data recorded yet. Add your first day in the Daily Monitoring tab.
      </div>
    );
  }

  // Dimensions for responsive SVG chart
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Max scale calculation
  const maxScreen = Math.max(...displayLogs.map((l) => l.screenTimeHours), 9);
  const maxSleep = Math.max(...displayLogs.map((l) => l.sleepHours), 9);
  const yMax = Math.max(maxScreen, maxSleep, 10);

  // Helper points for SVG lines
  const getX = (index: number) => {
    return paddingX + (index / (displayLogs.length - 1 || 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return paddingY + chartHeight - (value / yMax) * chartHeight;
  };

  // Generate SVG path strings
  const screenPoints = displayLogs.map((l, i) => `${getX(i)},${getY(l.screenTimeHours)}`).join(" ");
  const sleepPoints = displayLogs.map((l, i) => `${getX(i)},${getY(l.sleepHours)}`).join(" ");

  // Closed area paths for gradient fills
  const screenAreaPath = `M ${getX(0)},${paddingY + chartHeight} L ${displayLogs
    .map((l, i) => `${getX(i)},${getY(l.screenTimeHours)}`)
    .join(" L ")} L ${getX(displayLogs.length - 1)},${paddingY + chartHeight} Z`;

  const sleepAreaPath = `M ${getX(0)},${paddingY + chartHeight} L ${displayLogs
    .map((l, i) => `${getX(i)},${getY(l.sleepHours)}`)
    .join(" L ")} L ${getX(displayLogs.length - 1)},${paddingY + chartHeight} Z`;

  const activeHoverLog = hoveredIndex !== null ? displayLogs[hoveredIndex] : null;

  return (
    <div className="space-y-4">
      {/* Chart Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveMetric("screenVsSleep")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "screenVsSleep"
                ? "bg-[#00F5D4]/15 border border-[#00F5D4]/40 text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.15)]"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Screen Time vs Sleep
          </button>
          <button
            onClick={() => setActiveMetric("screenBreakdown")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "screenBreakdown"
                ? "bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 text-[#C77DFF] shadow-[0_0_15px_rgba(138,43,226,0.15)]"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Digital Time Breakdown
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          {activeMetric === "screenVsSleep" ? (
            <>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] shadow-[0_0_6px_#00F5D4]" />
                <span className="text-slate-300">Screen Time (hrs)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2] shadow-[0_0_6px_#8A2BE2]" />
                <span className="text-slate-300">Restorative Sleep (hrs)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C77DFF]" />
                <span className="text-slate-300">Social Media</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4]" />
                <span className="text-slate-300">Study / Work</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <span className="text-slate-300">Gaming</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Chart Surface */}
      <div className="relative p-3 sm:p-5 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
        {/* Active Tooltip Popover */}
        {activeHoverLog && (
          <div
            className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl glass-pill border border-white/15 shadow-xl text-left pointer-events-none animate-fadeIn"
          >
            <div className="text-[11px] font-mono text-slate-400">
              {activeHoverLog.dayLabel} ({activeHoverLog.date})
            </div>
            <div className="flex items-center space-x-3 mt-1 text-xs font-semibold">
              <span className="text-[#00F5D4]">
                Screen: {activeHoverLog.screenTimeHours}h
              </span>
              <span className="text-[#C77DFF]">
                Sleep: {activeHoverLog.sleepHours}h
              </span>
              <span className="text-amber-300">
                Breaks: {activeHoverLog.breaksCount}
              </span>
            </div>
          </div>
        )}

        {activeMetric === "screenVsSleep" ? (
          /* Line & Area Chart for Screen vs Sleep */
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 2.5, 5, 7.5, 10].map((val) => (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={getY(val)}
                    x2={svgWidth - paddingX}
                    y2={getY(val)}
                    stroke="rgba(255,255,255,0.07)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 10}
                    y={getY(val) + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {val}h
                  </text>
                </g>
              ))}

              {/* Area Fills */}
              <path d={screenAreaPath} fill="url(#tealGradient)" />
              <path d={sleepAreaPath} fill="url(#purpleGradient)" />

              {/* Lines */}
              <polyline
                fill="none"
                stroke="#00F5D4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={screenPoints}
              />
              <polyline
                fill="none"
                stroke="#8A2BE2"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sleepPoints}
              />

              {/* Data points & Interactive Hover Hitboxes */}
              {displayLogs.map((log, index) => {
                const sx = getX(index);
                const syScreen = getY(log.screenTimeHours);
                const sySleep = getY(log.sleepHours);
                const isHovered = hoveredIndex === index;

                return (
                  <g
                    key={log.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover vertical guide line */}
                    {isHovered && (
                      <line
                        x1={sx}
                        y1={paddingY}
                        x2={sx}
                        y2={paddingY + chartHeight}
                        stroke="rgba(255,255,255,0.25)"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Screen dot */}
                    <circle
                      cx={sx}
                      cy={syScreen}
                      r={isHovered ? 5.5 : 3.5}
                      fill="#07090e"
                      stroke="#00F5D4"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Sleep dot */}
                    <circle
                      cx={sx}
                      cy={sySleep}
                      r={isHovered ? 5.5 : 3.5}
                      fill="#07090e"
                      stroke="#8A2BE2"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* X-axis day label */}
                    <text
                      x={sx}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className={`text-[10px] font-mono transition-colors ${
                        isHovered ? "fill-[#00F5D4] font-bold" : "fill-slate-400"
                      }`}
                    >
                      {log.dayLabel.split(" ")[0]}
                    </text>

                    {/* Invisible Hitbox for easy hover */}
                    <rect
                      x={sx - 20}
                      y={paddingY}
                      width={40}
                      height={chartHeight}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Bar Chart Breakdown: Social vs Study vs Gaming */
          <div className="w-full overflow-x-auto pt-3">
            <div className="grid grid-cols-7 gap-2 min-w-[500px]">
              {displayLogs.map((log, index) => {
                const total = log.socialMediaHours + log.studyHours + log.gamingHours || 1;
                const socialPct = Math.round((log.socialMediaHours / total) * 100);
                const studyPct = Math.round((log.studyHours / total) * 100);
                const gamingPct = Math.round((log.gamingHours / total) * 100);

                return (
                  <div
                    key={log.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex flex-col items-center space-y-2 cursor-pointer group"
                  >
                    {/* Stacked Bar Container */}
                    <div className="relative w-full h-36 bg-white/[0.03] rounded-xl flex flex-col justify-end p-1 overflow-hidden border border-white/5 group-hover:border-white/20 transition-all">
                      {/* Gaming (Top) */}
                      <div
                        style={{ height: `${gamingPct}%` }}
                        className="w-full bg-[#3B82F6]/80 rounded-t-sm transition-all"
                        title={`Gaming: ${log.gamingHours}h`}
                      />
                      {/* Social Media (Middle) */}
                      <div
                        style={{ height: `${socialPct}%` }}
                        className="w-full bg-[#C77DFF]/80 transition-all"
                        title={`Social: ${log.socialMediaHours}h`}
                      />
                      {/* Study (Bottom) */}
                      <div
                        style={{ height: `${studyPct}%` }}
                        className="w-full bg-[#00F5D4]/80 rounded-b-sm transition-all"
                        title={`Study: ${log.studyHours}h`}
                      />
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-300 block">
                        {log.dayLabel.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-mono text-[#00F5D4]">
                        {log.screenTimeHours}h
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
