export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  screenTimeHours: number;
  socialMediaHours: number;
  gamingHours: number;
  sleepHours: number;
  studyHours: number;
  breaksCount: number;
  physicalActivityMinutes: number;
  mood: MoodRating;
  privateNotes?: string;
  isAutoTracked?: boolean;
  // MongoDB backend fields
  userId?: string;
  moodScore?: number; // 1-10
  stressLevel?: number; // 1-10
  screenTimeMinutes?: number;
  notes?: string;
  syncMode?: "manual" | "auto";
}

export interface HabitItem {
  id: string;
  title: string;
  category: "screen" | "sleep" | "body" | "mind" | "social" | string;
  description?: string;
  completed: boolean;
  // MongoDB backend fields
  userId?: string;
  targetFrequency?: string;
  completedDates?: string[];
  streak?: number;
}

export interface ReminderSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  frequency: string;
  targetTime?: string;
}

export interface InsightCard {
  id: string;
  type: "positive" | "gentle-nudge" | "insight" | "milestone";
  title: string;
  metricHighlight: string;
  description: string;
  actionableTip: string;
}

export interface AutoTrackingState {
  enabled: boolean;
  permissionGranted: boolean;
  activeSessionSeconds: number;
  idlePauseSeconds: number;
  isPaused: boolean;
  isUserActive: boolean;
  lastAutoSyncTime?: string;
  autoDetectedScreenTime: number; // in hours
  autoDetectedBreaks: number;
}
