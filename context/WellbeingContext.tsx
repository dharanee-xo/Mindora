"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { DailyLog, HabitItem, ReminderSetting, MoodRating } from "@/types/wellbeing";

interface WellbeingContextType {
  userId: string;
  logs: DailyLog[];
  habits: HabitItem[];
  reminders: ReminderSetting[];
  activeLog: DailyLog;
  habitCompletionRate: number;
  addOrUpdateLog: (log: Omit<DailyLog, "id">, existingId?: string) => void;
  deleteLog: (id: string) => void;
  toggleHabit: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateReminderFrequency: (id: string, frequency: string) => void;
  updateTodayMood: (mood: MoodRating) => void;
  clearAllData: () => void;
  resetToDemoData: () => void;

  // Dual Monitoring System State
  isAutoMonitoringEnabled: boolean;
  isPermissionGranted: boolean;
  activeSessionSeconds: number;
  sessionStatus: "active" | "idle" | "paused";
  autoDetectedScreenHours: number;
  autoDetectedBreaks: number;
  enableAutoMonitoring: () => void;
  disableAutoMonitoring: () => void;
  pauseResumeAutoMonitoring: () => void;
  syncAutoDataToToday: () => void;
}

const defaultLogs: DailyLog[] = [
  {
    id: "log-1",
    date: "2026-11-10",
    dayLabel: "Mon",
    screenTimeHours: 6.8,
    socialMediaHours: 2.5,
    gamingHours: 1.5,
    sleepHours: 6.2,
    studyHours: 3.5,
    breaksCount: 3,
    physicalActivityMinutes: 25,
    mood: 2,
    privateNotes: "Mid-term exam stress caused late-night scrolling.",
  },
  {
    id: "log-2",
    date: "2026-11-11",
    dayLabel: "Tue",
    screenTimeHours: 7.1,
    socialMediaHours: 2.8,
    gamingHours: 1.8,
    sleepHours: 5.9,
    studyHours: 4.0,
    breaksCount: 2,
    physicalActivityMinutes: 20,
    mood: 2,
    privateNotes: "Felt drained by 4 PM. Needed more water and breaks.",
  },
  {
    id: "log-3",
    date: "2026-11-12",
    dayLabel: "Wed",
    screenTimeHours: 5.5,
    socialMediaHours: 1.9,
    gamingHours: 1.0,
    sleepHours: 7.2,
    studyHours: 4.5,
    breaksCount: 5,
    physicalActivityMinutes: 40,
    mood: 3,
    privateNotes: "Tried the 20-20-20 eye break rule today, noticeable focus improvement.",
  },
  {
    id: "log-4",
    date: "2026-11-13",
    dayLabel: "Thu",
    screenTimeHours: 6.0,
    socialMediaHours: 2.0,
    gamingHours: 1.2,
    sleepHours: 6.8,
    studyHours: 4.2,
    breaksCount: 4,
    physicalActivityMinutes: 35,
    mood: 3,
    privateNotes: "Moderate productivity, kept social notifications off during library hours.",
  },
  {
    id: "log-5",
    date: "2026-11-14",
    dayLabel: "Fri",
    screenTimeHours: 5.2,
    socialMediaHours: 1.4,
    gamingHours: 0.8,
    sleepHours: 7.6,
    studyHours: 5.0,
    breaksCount: 6,
    physicalActivityMinutes: 50,
    mood: 4,
    privateNotes: "Went for evening walk around campus lake, sleep was noticeably deeper.",
  },
  {
    id: "log-6",
    date: "2026-11-15",
    dayLabel: "Sat",
    screenTimeHours: 4.9,
    socialMediaHours: 1.3,
    gamingHours: 0.7,
    sleepHours: 8.1,
    studyHours: 3.8,
    breaksCount: 5,
    physicalActivityMinutes: 55,
    mood: 5,
    privateNotes: "Kept laptop closed until after lunch. Highly recommend.",
  },
  {
    id: "log-7",
    date: "2026-11-16",
    dayLabel: "Sun (Today)",
    screenTimeHours: 4.8,
    socialMediaHours: 1.1,
    gamingHours: 0.6,
    sleepHours: 7.8,
    studyHours: 4.5,
    breaksCount: 6,
    physicalActivityMinutes: 45,
    mood: 4,
    privateNotes: "Balanced weekend rhythm. Ready for the upcoming academic week.",
  },
];

const defaultHabits: HabitItem[] = [
  {
    id: "habit-1",
    title: "Balanced Screen Leisure",
    category: "screen",
    description: "Keep non-academic social media & browsing under 3 hours.",
    completed: true,
  },
  {
    id: "habit-2",
    title: "20-20-20 Eye Rest Breaks",
    category: "screen",
    description: "Take brief distance pauses every 20-30 minutes of study.",
    completed: true,
  },
  {
    id: "habit-3",
    title: "Consistent Sleep Wind-Down",
    category: "sleep",
    description: "Activate screen blue-light filter and dim displays 45m before bed.",
    completed: true,
  },
  {
    id: "habit-4",
    title: "Natural Daylight & Outdoor Air",
    category: "body",
    description: "Get at least 25 minutes of natural sunlight and fresh air.",
    completed: true,
  },
  {
    id: "habit-5",
    title: "Physical Activity & Stretching",
    category: "body",
    description: "Engage in 30+ minutes of brisk walking, exercise, or yoga.",
    completed: true,
  },
  {
    id: "habit-6",
    title: "Offline Reading / Journaling",
    category: "mind",
    description: "Read physical book pages or reflect with pen and paper.",
    completed: false,
  },
  {
    id: "habit-7",
    title: "Mealtime Phone-Free Zone",
    category: "social",
    description: "Eat lunch or dinner with zero screens to practice somatic mindfulness.",
    completed: false,
  },
];

const defaultReminders: ReminderSetting[] = [
  {
    id: "rem-1",
    title: "Hydration & Posture Realignment",
    description: "Gentle reminder to sip water and relax shoulder tension.",
    enabled: true,
    frequency: "Every 45 mins",
  },
  {
    id: "rem-2",
    title: "20-20-20 Eye Strain Reset",
    description: "Look at an object 20 feet away for 20 seconds to ease focus fatigue.",
    enabled: true,
    frequency: "Every 25 mins",
  },
  {
    id: "rem-3",
    title: "Evening Digital Wind-Down",
    description: "Reminder to switch displays to greyscale and silence group notifications.",
    enabled: true,
    frequency: "Daily at 10:30 PM",
    targetTime: "22:30",
  },
  {
    id: "rem-4",
    title: "Mindful Breath Interval",
    description: "3-minute diaphragmatic breathing prompt during high screen intervals.",
    enabled: false,
    frequency: "Every 90 mins",
  },
];

const WellbeingContext = createContext<WellbeingContextType | undefined>(undefined);

export function WellbeingProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("anonymous_student");
  const [logs, setLogs] = useState<DailyLog[]>(defaultLogs);
  const [habits, setHabits] = useState<HabitItem[]>(defaultHabits);
  const [reminders, setReminders] = useState<ReminderSetting[]>(defaultReminders);
  const [isClient, setIsClient] = useState(false);

  // Auto-monitoring HUD & background listener state
  const [isAutoMonitoringEnabled, setIsAutoMonitoringEnabled] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(2535); // demo start 42m 15s
  const [sessionStatus, setSessionStatus] = useState<"active" | "idle" | "paused">("paused");
  const [autoDetectedScreenHours, setAutoDetectedScreenHours] = useState(4.8);
  const [autoDetectedBreaks, setAutoDetectedBreaks] = useState(6);

  const lastActivityRef = useRef<number>(Date.now());

  // Initialize from LocalStorage & MongoDB
  useEffect(() => {
    setIsClient(true);
    let activeUser = "anonymous_student";
    try {
      const savedUser = localStorage.getItem("mindora_active_user");
      if (savedUser) {
        activeUser = savedUser;
        setUserId(savedUser);
      }

      const savedLogs = localStorage.getItem("mindora_logs");
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const savedHabits = localStorage.getItem("mindora_habits");
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedReminders = localStorage.getItem("mindora_reminders");
      if (savedReminders) setReminders(JSON.parse(savedReminders));

      const savedAutoEnabled = localStorage.getItem("mindora_auto_monitoring");
      if (savedAutoEnabled === "true") {
        setIsAutoMonitoringEnabled(true);
        setIsPermissionGranted(true);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }

    // Connect & Sync from MongoDB Backend
    fetch(`/api/logs?userId=${encodeURIComponent(activeUser)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      })
      .catch((e) => console.warn("MongoDB initial logs sync:", e));

    fetch(`/api/habits?userId=${encodeURIComponent(activeUser)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.record && data.record.completedHabitIds) {
          const completedIds: string[] = data.record.completedHabitIds;
          setHabits((prev) =>
            prev.map((h) => ({
              ...h,
              completed: completedIds.includes(h.id),
            }))
          );
        }
      })
      .catch((e) => console.warn("MongoDB initial habits sync:", e));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("mindora_logs", JSON.stringify(logs));
      localStorage.setItem("mindora_habits", JSON.stringify(habits));
      localStorage.setItem("mindora_reminders", JSON.stringify(reminders));
      localStorage.setItem("mindora_auto_monitoring", isAutoMonitoringEnabled.toString());
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [logs, habits, reminders, isAutoMonitoringEnabled, isClient]);

  // Live Browser Activity Listener
  useEffect(() => {
    if (!isAutoMonitoringEnabled || sessionStatus === "paused") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSessionStatus("idle");
        setAutoDetectedBreaks((prev) => prev + 1);
      } else {
        setSessionStatus("active");
        lastActivityRef.current = Date.now();
      }
    };

    const handleUserInteraction = () => {
      lastActivityRef.current = Date.now();
      if (sessionStatus === "idle") {
        setSessionStatus("active");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > 60000) {
        if (sessionStatus !== "idle") {
          setSessionStatus("idle");
          setAutoDetectedBreaks((prev) => prev + 1);
        }
      } else {
        setActiveSessionSeconds((prev) => {
          const nextSec = prev + 1;
          if (nextSec % 360 === 0) {
            setAutoDetectedScreenHours((h) => +(h + 0.1).toFixed(1));
          }
          return nextSec;
        });
      }
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      clearInterval(timer);
    };
  }, [isAutoMonitoringEnabled, sessionStatus]);

  const activeLog = logs[logs.length - 1] || defaultLogs[defaultLogs.length - 1];

  const habitCompletionRate = Math.round(
    (habits.filter((h) => h.completed).length / habits.length) * 100
  );

  const addOrUpdateLog = (newLogData: Omit<DailyLog, "id">, existingId?: string) => {
    if (existingId) {
      setLogs((prev) =>
        prev.map((log) => (log.id === existingId ? { ...newLogData, id: existingId } : log))
      );
    } else {
      const newEntry: DailyLog = {
        ...newLogData,
        id: `log-${Date.now()}`,
      };
      setLogs((prev) => [...prev, newEntry]);
    }

    // Persist to MongoDB API
    const currentUserId = localStorage.getItem("mindora_active_user") || userId;
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUserId,
        ...newLogData,
      }),
    }).catch((err) => console.warn("Failed to sync log to MongoDB:", err));
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h));
    setHabits(updatedHabits);

    // Persist to MongoDB API
    const currentUserId = localStorage.getItem("mindora_active_user") || userId;
    const completedIds = updatedHabits.filter((h) => h.completed).map((h) => h.id);
    fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUserId,
        completedHabitIds: completedIds,
        streakCount: 12,
      }),
    }).catch((err) => console.warn("Failed to sync habits to MongoDB:", err));
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateReminderFrequency = (id: string, frequency: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, frequency } : r))
    );
  };

  const updateTodayMood = (newMood: MoodRating) => {
    setLogs((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const updated = [...prev];
      updated[lastIndex] = {
        ...updated[lastIndex],
        mood: newMood,
      };
      return updated;
    });

    // Persist to MongoDB API immediately
    const currentUserId = localStorage.getItem("mindora_active_user") || userId;
    const today = logs[logs.length - 1] || defaultLogs[defaultLogs.length - 1];
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUserId,
        date: today.date,
        dayLabel: today.dayLabel,
        screenTimeHours: today.screenTimeHours,
        socialMediaHours: today.socialMediaHours,
        gamingHours: today.gamingHours,
        sleepHours: today.sleepHours,
        studyHours: today.studyHours,
        breaksCount: today.breaksCount,
        physicalActivityMinutes: today.physicalActivityMinutes,
        mood: newMood,
        privateNotes: today.privateNotes,
        isAutoTracked: today.isAutoTracked,
      }),
    }).catch((err) => console.warn("Failed to sync mood to MongoDB:", err));
  };

  const enableAutoMonitoring = () => {
    setIsPermissionGranted(true);
    setIsAutoMonitoringEnabled(true);
    setSessionStatus("active");
  };

  const disableAutoMonitoring = () => {
    setIsAutoMonitoringEnabled(false);
    setSessionStatus("paused");
  };

  const pauseResumeAutoMonitoring = () => {
    setSessionStatus((prev) => (prev === "paused" ? "active" : "paused"));
  };

  const syncAutoDataToToday = () => {
    if (logs.length > 0) {
      const today = logs[logs.length - 1];
      const updatedLog: DailyLog = {
        ...today,
        screenTimeHours: autoDetectedScreenHours,
        breaksCount: Math.max(today.breaksCount, autoDetectedBreaks),
        studyHours: +(today.studyHours + (activeSessionSeconds / 3600)).toFixed(1),
        isAutoTracked: true,
      };
      setLogs((prev) => [...prev.slice(0, -1), updatedLog]);

      // Persist auto-synced values to MongoDB
      const currentUserId = localStorage.getItem("mindora_active_user") || userId;
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          ...updatedLog,
        }),
      }).catch((err) => console.warn("Auto-sync save to MongoDB:", err));
    }
  };

  const clearAllData = () => {
    const currentUserId = localStorage.getItem("mindora_active_user") || userId;

    // Purge records from MongoDB
    fetch(`/api/privacy/purge?userId=${encodeURIComponent(currentUserId)}`, {
      method: "DELETE",
    }).catch((err) => console.warn("MongoDB purge error:", err));

    setLogs([]);
    setHabits(defaultHabits.map((h) => ({ ...h, completed: false })));
    setIsAutoMonitoringEnabled(false);
    setIsPermissionGranted(false);
    localStorage.removeItem("mindora_logs");
    localStorage.removeItem("mindora_habits");
    localStorage.removeItem("mindora_reminders");
    localStorage.removeItem("mindora_auto_monitoring");
  };

  const resetToDemoData = () => {
    setLogs(defaultLogs);
    setHabits(defaultHabits);
    setReminders(defaultReminders);
  };

  return (
    <WellbeingContext.Provider
      value={{
        userId,
        logs,
        habits,
        reminders,
        activeLog,
        habitCompletionRate,
        addOrUpdateLog,
        deleteLog,
        toggleHabit,
        toggleReminder,
        updateReminderFrequency,
        updateTodayMood,
        clearAllData,
        resetToDemoData,
        // Dual Monitoring System
        isAutoMonitoringEnabled,
        isPermissionGranted,
        activeSessionSeconds,
        sessionStatus,
        autoDetectedScreenHours,
        autoDetectedBreaks,
        enableAutoMonitoring,
        disableAutoMonitoring,
        pauseResumeAutoMonitoring,
        syncAutoDataToToday,
      }}
    >
      {children}
    </WellbeingContext.Provider>
  );
}

export function useWellbeing() {
  const context = useContext(WellbeingContext);
  if (!context) {
    throw new Error("useWellbeing must be used within a WellbeingProvider");
  }
  return context;
}
