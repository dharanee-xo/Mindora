"use client";

import React, { useState } from "react";
import { useWellbeing } from "@/context/WellbeingContext";
import { SparklesIcon, CheckCircleIcon, FlameIcon, TrashIcon } from "../Icons";

export default function HabitTracker() {
  const { habits, toggleHabit, createHabit, deleteHabit, habitCompletionRate, isLoadingHabits } = useWellbeing();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // State for creating a new habit
  const [isAddingHabit, setIsAddingHabit] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("screen");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const completedCount = habits.filter((h) => h.completed).length;

  const filteredHabits =
    selectedFilter === "all"
      ? habits
      : habits.filter((h) => h.category === selectedFilter);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createHabit(newTitle.trim(), newCategory);
      setNewTitle("");
      setIsAddingHabit(false);
    } catch (err) {
      console.error("Failed to create habit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHabit = async (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    if (confirm("Delete this habit goal?")) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleek Top Progress Bar & Header */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
                Daily Focus Goals
              </span>
              <span className="text-xs font-mono text-slate-400">
                • {completedCount} of {habits.length} Done
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Habit Checklist & Streak Tracker
            </h3>
          </div>

          {/* Action: Add Habit + Metric Badge */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={() => setIsAddingHabit(!isAddingHabit)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all"
            >
              {isAddingHabit ? "Cancel" : "+ Add Habit"}
            </button>

            <div className="flex items-center space-x-2.5 bg-white/[0.03] p-2.5 px-3.5 rounded-2xl border border-white/10">
              <span className="text-2xl font-extrabold font-mono text-white">
                {habitCompletionRate}%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {completedCount >= 5 ? "Optimal" : "In Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full h-2 bg-black/40 rounded-full overflow-hidden p-0 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#C77DFF] rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(0,245,212,0.5)]"
            style={{ width: `${habitCompletionRate}%` }}
          />
        </div>

        {/* 1-Line Motivational Feedback */}
        <p className="text-xs text-slate-400 mt-3 flex items-center space-x-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>
            {habitCompletionRate >= 70
              ? "Great momentum. You are prioritizing restorative offline recovery."
              : "Every single offline pause counts. Take your time without pressure."}
          </span>
        </p>
      </div>

      {/* Add Habit Inline Form Drawer */}
      {isAddingHabit && (
        <form
          onSubmit={handleCreateHabit}
          className="p-5 rounded-2xl glass-panel border border-[#00F5D4]/30 shadow-glass space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Create New Habit Goal</h4>
            <span className="text-xs text-slate-400 font-mono">Syncs to MongoDB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Habit Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 15-Minute Evening Stargazing or Walk"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5D4]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00F5D4]"
              >
                <option value="screen">Screen & Eyes</option>
                <option value="sleep">Sleep Wind-Down</option>
                <option value="body">Body & Movement</option>
                <option value="mind">Offline Mind</option>
                <option value="social">Social & Balance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingHabit(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newTitle.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Habit"}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Goals" },
          { id: "screen", label: "Screen & Eyes" },
          { id: "sleep", label: "Sleep" },
          { id: "body", label: "Movement" },
          { id: "mind", label: "Offline Mind" },
          { id: "social", label: "Social" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === f.id
                ? "bg-[#00F5D4] text-[#07090e] font-bold shadow-[0_0_12px_rgba(0,245,212,0.3)]"
                : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading state indicator */}
      {isLoadingHabits && habits.length === 0 && (
        <div className="p-8 text-center text-xs text-slate-400 font-mono">
          Syncing habits from MongoDB...
        </div>
      )}

      {/* Spacious 2-Column Habit Grid with Streaks & Deletion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredHabits.map((habit) => {
          const streakCount = habit.streak ?? (habit.completed ? 1 : 0);

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-4 sm:p-5 rounded-2xl glass-panel-interactive border cursor-pointer select-none transition-all flex items-start space-x-3.5 group relative ${
                habit.completed
                  ? "border-[#00F5D4]/40 bg-gradient-to-r from-[#00F5D4]/[0.05] to-transparent shadow-[0_0_15px_rgba(0,245,212,0.08)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Custom Checkbox */}
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                  habit.completed
                    ? "bg-[#00F5D4] border-[#00F5D4] text-[#07090e] shadow-[0_0_8px_rgba(0,245,212,0.5)]"
                    : "border-white/30 bg-white/5 hover:border-[#00F5D4]"
                }`}
              >
                {habit.completed && (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`text-sm font-bold transition-colors truncate ${
                      habit.completed
                        ? "text-slate-300 line-through opacity-75"
                        : "text-white"
                    }`}
                  >
                    {habit.title}
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase flex-shrink-0">
                    {habit.category}
                  </span>
                </div>

                {habit.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {habit.description}
                  </p>
                )}

                {/* Streak Counter Badge */}
                <div className="mt-2.5 flex items-center space-x-2 text-xs">
                  <div
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                      streakCount > 0
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : "bg-white/5 border border-white/10 text-slate-400"
                    }`}
                  >
                    <FlameIcon className="w-3 h-3 text-amber-400" />
                    <span>{streakCount}d streak</span>
                  </div>

                  {habit.completed && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      Completed Today ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Habit Action Button */}
              <button
                type="button"
                onClick={(e) => handleDeleteHabit(e, habit.id)}
                title="Delete habit"
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
