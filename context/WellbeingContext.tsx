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
  isLoadingLogs: boolean;
  isLoadingHabits: boolean;
  isSaving: boolean;
  apiError: string | null;

  // Actions wired to real MongoDB APIs
  addOrUpdateLog: (log: Omit<DailyLog, "id">, existingId?: string) => Promise<void>;
  deleteLog: (id: string) => void;
  toggleHabit: (id: string) => Promise<void>;
  createHabit: (title: string, category: string, targetFrequency?: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleReminder: (id: string) => void;
  updateReminderFrequency: (id: string, frequency: string) => void;
  updateTodayMood: (mood: MoodRating) => Promise<void>;
  clearAllData: () => Promise<void>;
  resetToDemoData: () => void;
  refreshData: () => Promise<void>;

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
  syncAutoDataToToday: () => Promise<void>;
}

const defaultHabitCatalog: HabitItem[] = [
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

const fallbackTodayLog: DailyLog = {
  id: "today-default",
  date: new Date().toISOString().split("T")[0],
  dayLabel: "Today",
  screenTimeHours: 4.8,
  socialMediaHours: 1.2,
  gamingHours: 0.5,
  sleepHours: 7.5,
  studyHours: 4.5,
  breaksCount: 5,
  physicalActivityMinutes: 30,
  mood: 3,
  privateNotes: "",
  isAutoTracked: false,
  moodScore: 6,
  stressLevel: 3,
};

const WellbeingContext = createContext<WellbeingContextType | undefined>(undefined);

export function WellbeingProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("anonymous_student");
  const [logs, setLogs] = useState<DailyLog[]>([fallbackTodayLog]);
  const [habits, setHabits] = useState<HabitItem[]>(defaultHabitCatalog);
  const [reminders, setReminders] = useState<ReminderSetting[]>(defaultReminders);

  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [isLoadingHabits, setIsLoadingHabits] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dual Monitoring State
  const [isAutoMonitoringEnabled, setIsAutoMonitoringEnabled] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(2535); // 42m 15s
  const [sessionStatus, setSessionStatus] = useState<"active" | "idle" | "paused">("paused");
  const [autoDetectedScreenHours, setAutoDetectedScreenHours] = useState(4.8);
  const [autoDetectedBreaks, setAutoDetectedBreaks] = useState(6);

  const lastActivityRef = useRef<number>(Date.now());

  // Function to fetch real data from MongoDB APIs
  const refreshData = async () => {
    try {
      setApiError(null);
      setIsLoadingLogs(true);
      setIsLoadingHabits(true);

      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      setUserId(activeUser);

      // 1. Fetch real daily logs from MongoDB
      const logsRes = await fetch("/api/logs", {
        headers: { "x-user-id": activeUser },
      });

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.success && Array.isArray(logsData.logs) && logsData.logs.length > 0) {
          // Sort ascending for chart chronological display
          const sorted = [...logsData.logs].sort((a, b) => a.date.localeCompare(b.date));
          setLogs(sorted);
        }
      }

      // 2. Fetch real habits from MongoDB
      const habitsRes = await fetch("/api/habits", {
        headers: { "x-user-id": activeUser },
      });

      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        if (habitsData.success && Array.isArray(habitsData.habits) && habitsData.habits.length > 0) {
          setHabits(habitsData.habits);
        }
      }
    } catch (err: any) {
      console.warn("MongoDB initial fetch warning:", err);
      setApiError(err.message || "Failed to sync with MongoDB.");
    } finally {
      setIsLoadingLogs(false);
      setIsLoadingHabits(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mindora_active_user");
      if (savedUser) setUserId(savedUser);

      const savedAuto = localStorage.getItem("mindora_auto_monitoring");
      if (savedAuto === "true") {
        setIsAutoMonitoringEnabled(true);
        setIsPermissionGranted(true);
      }
    } catch (e) {
      console.warn("Storage check error:", e);
    }

    refreshData();
  }, []);

  // Live Browser Activity Listener (Page Visibility API)
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

  const activeLog = logs[logs.length - 1] || fallbackTodayLog;

  const habitCompletionRate = habits.length > 0
    ? Math.round((habits.filter((h) => h.completed).length / habits.length) * 100)
    : 0;

  // Real MongoDB API: Add or update daily log
  const addOrUpdateLog = async (newLogData: Omit<DailyLog, "id">, existingId?: string) => {
    setIsSaving(true);
    setApiError(null);

    // Optimistic state update
    const todayStr = newLogData.date || new Date().toISOString().split("T")[0];
    const optimisticLog: DailyLog = {
      ...newLogData,
      id: existingId || `temp-${Date.now()}`,
      date: todayStr,
    };

    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === todayStr || (existingId && l.id === existingId));
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...optimisticLog };
        return copy;
      }
      return [...prev, optimisticLog];
    });

    try {
      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser,
        },
        body: JSON.stringify({
          ...newLogData,
          date: todayStr,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to save log (${res.status})`);
      }

      const data = await res.json();
      if (data.success && data.log) {
        setLogs((prev) => {
          const idx = prev.findIndex((l) => l.date === todayStr);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = data.log;
            return copy;
          }
          return [...prev, data.log];
        });
      }
    } catch (err: any) {
      console.error("addOrUpdateLog error:", err);
      setApiError(err.message || "Failed to persist to database.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Real MongoDB API: Toggle habit completion
  const toggleHabit = async (id: string) => {
    setApiError(null);
    const todayStr = new Date().toISOString().split("T")[0];

    // Optimistic toggle
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );

    try {
      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      const res = await fetch("/api/habits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser,
        },
        body: JSON.stringify({
          habitId: id,
          date: todayStr,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to toggle habit in MongoDB.");
      }

      const data = await res.json();
      if (data.success && data.habit) {
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? { ...h, ...data.habit } : h))
        );
      }
    } catch (err: any) {
      console.error("toggleHabit error:", err);
      setApiError(err.message || "Failed to update habit streak.");
    }
  };

  // Real MongoDB API: Create habit
  const createHabit = async (title: string, category: string, targetFrequency = "daily") => {
    try {
      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser,
        },
        body: JSON.stringify({ title, category, targetFrequency }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.habit) {
          setHabits((prev) => [...prev, data.habit]);
        }
      }
    } catch (err: any) {
      console.error("createHabit error:", err);
    }
  };

  // Real MongoDB API: Delete habit
  const deleteHabit = async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    try {
      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      await fetch(`/api/habits?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-user-id": activeUser },
      });
    } catch (err) {
      console.error("deleteHabit error:", err);
    }
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

  // Real MongoDB API: Update today's mood
  const updateTodayMood = async (newMood: MoodRating) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const moodScore = newMood === 5 ? 10 : newMood === 4 ? 8 : newMood === 3 ? 6 : newMood === 2 ? 4 : 2;
    const moodLabel = newMood >= 4 ? "Positive" : newMood === 3 ? "Neutral" : newMood === 2 ? "Negative" : "Depressed";

    // Optimistic update
    setLogs((prev) => {
      if (prev.length === 0) return [fallbackTodayLog];
      const lastIndex = prev.length - 1;
      const updated = [...prev];
      updated[lastIndex] = {
        ...updated[lastIndex],
        mood: newMood,
        moodScore,
      };
      return updated;
    });

    try {
      const current = logs[logs.length - 1] || fallbackTodayLog;
      const activeUser = localStorage.getItem("mindora_active_user") || userId;

      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser,
        },
        body: JSON.stringify({
          date: todayStr,
          moodScore,
          mood: moodLabel,
          screenTimeHours: current.screenTimeHours,
          sleepHours: current.sleepHours,
          studyHours: current.studyHours,
          socialMediaHours: current.socialMediaHours,
          gamingHours: current.gamingHours,
          breaksCount: current.breaksCount,
          physicalActivityMinutes: current.physicalActivityMinutes,
          notes: current.privateNotes || current.notes || "",
        }),
      });
    } catch (err) {
      console.error("updateTodayMood error:", err);
    }
  };

  const enableAutoMonitoring = () => {
    setIsPermissionGranted(true);
    setIsAutoMonitoringEnabled(true);
    setSessionStatus("active");
    try {
      localStorage.setItem("mindora_auto_monitoring", "true");
    } catch {}
  };

  const disableAutoMonitoring = () => {
    setIsAutoMonitoringEnabled(false);
    setSessionStatus("paused");
    try {
      localStorage.setItem("mindora_auto_monitoring", "false");
    } catch {}
  };

  const pauseResumeAutoMonitoring = () => {
    setSessionStatus((prev) => (prev === "paused" ? "active" : "paused"));
  };

  // Real MongoDB API: Sync Auto HUD metrics
  const syncAutoDataToToday = async () => {
    if (logs.length > 0) {
      const today = logs[logs.length - 1];
      const updatedLog: DailyLog = {
        ...today,
        screenTimeHours: autoDetectedScreenHours,
        breaksCount: Math.max(today.breaksCount, autoDetectedBreaks),
        studyHours: +(today.studyHours + activeSessionSeconds / 3600).toFixed(1),
        isAutoTracked: true,
      };
      setLogs((prev) => [...prev.slice(0, -1), updatedLog]);

      try {
        const activeUser = localStorage.getItem("mindora_active_user") || userId;
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": activeUser,
          },
          body: JSON.stringify(updatedLog),
        });
      } catch (err) {
        console.error("syncAutoDataToToday error:", err);
      }
    }
  };

  // Real MongoDB API: Permanently purge all user records
  const clearAllData = async () => {
    try {
      const activeUser = localStorage.getItem("mindora_active_user") || userId;
      await fetch("/api/privacy/purge", {
        method: "DELETE",
        headers: { "x-user-id": activeUser },
      });
    } catch (err) {
      console.warn("MongoDB purge error:", err);
    }

    setLogs([]);
    setHabits([]);
    setIsAutoMonitoringEnabled(false);
    setIsPermissionGranted(false);
    try {
      localStorage.removeItem("mindora_logs");
      localStorage.removeItem("mindora_habits");
      localStorage.removeItem("mindora_reminders");
      localStorage.removeItem("mindora_auto_monitoring");
    } catch {}
  };

  const resetToDemoData = () => {
    refreshData();
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
        isLoadingLogs,
        isLoadingHabits,
        isSaving,
        apiError,
        addOrUpdateLog,
        deleteLog,
        toggleHabit,
        createHabit,
        deleteHabit,
        toggleReminder,
        updateReminderFrequency,
        updateTodayMood,
        clearAllData,
        resetToDemoData,
        refreshData,
        // Dual Monitoring
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
