import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";

// Helper to normalize mood input from frontend (number 1-5 or string) to DB enum
function normalizeMoodToDb(mood: any): "Positive" | "Neutral" | "Negative" | "Depressed" {
  if (mood === 5 || mood === 4 || mood === "Positive") return "Positive";
  if (mood === 3 || mood === "Neutral") return "Neutral";
  if (mood === 2 || mood === "Negative") return "Negative";
  if (mood === 1 || mood === "Depressed") return "Depressed";
  return "Neutral";
}

// Helper to convert DB mood to numeric rating 1-5 for Recharts & frontend calculations
function moodToRating(moodStr: string): 1 | 2 | 3 | 4 | 5 {
  switch (moodStr) {
    case "Positive":
      return 4;
    case "Neutral":
      return 3;
    case "Negative":
      return 2;
    case "Depressed":
      return 1;
    default:
      return 3;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous_student";

    await connectToDatabase();

    const dbLogs = await DailyLog.find({ userId }).sort({ date: 1 }).lean();

    // Map to frontend DailyLog interface
    const formattedLogs = dbLogs.map((log: any) => ({
      id: log._id.toString(),
      date: log.date,
      dayLabel: log.dayLabel || log.date,
      screenTimeHours: log.screenTime,
      socialMediaHours: log.socialMedia,
      gamingHours: log.gaming,
      sleepHours: log.sleep,
      studyHours: log.study,
      breaksCount: log.breaks,
      physicalActivityMinutes: log.physicalActivityMinutes || 0,
      mood: moodToRating(log.mood),
      moodLabel: log.mood,
      privateNotes: log.reflection || "",
      isAutoTracked: log.syncMode === "auto",
    }));

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
      count: formattedLogs.length,
    });
  } catch (error: any) {
    console.error("GET /api/logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch logs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "anonymous_student",
      date = new Date().toISOString().split("T")[0],
      dayLabel = "Today",
      screenTimeHours = 0,
      screenTime,
      socialMediaHours = 0,
      socialMedia,
      gamingHours = 0,
      gaming,
      sleepHours = 0,
      sleep,
      studyHours = 0,
      study,
      breaksCount = 0,
      breaks,
      physicalActivityMinutes = 0,
      mood = "Neutral",
      privateNotes = "",
      reflection,
      isAutoTracked = false,
      syncMode,
    } = body;

    await connectToDatabase();

    const dbMood = normalizeMoodToDb(mood);
    const dbSyncMode = syncMode || (isAutoTracked ? "auto" : "manual");

    const updateDoc = {
      userId,
      date,
      dayLabel,
      screenTime: Number(screenTimeHours ?? screenTime ?? 0),
      socialMedia: Number(socialMediaHours ?? socialMedia ?? 0),
      gaming: Number(gamingHours ?? gaming ?? 0),
      sleep: Number(sleepHours ?? sleep ?? 0),
      study: Number(studyHours ?? study ?? 0),
      breaks: Number(breaksCount ?? breaks ?? 0),
      physicalActivityMinutes: Number(physicalActivityMinutes ?? 0),
      mood: dbMood,
      reflection: String(reflection ?? privateNotes ?? ""),
      syncMode: dbSyncMode,
    };

    const savedLog = await DailyLog.findOneAndUpdate(
      { userId, date },
      updateDoc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Daily activity log saved to MongoDB.",
      log: {
        id: savedLog._id.toString(),
        date: savedLog.date,
        dayLabel: savedLog.dayLabel,
        screenTimeHours: savedLog.screenTime,
        socialMediaHours: savedLog.socialMedia,
        gamingHours: savedLog.gaming,
        sleepHours: savedLog.sleep,
        studyHours: savedLog.study,
        breaksCount: savedLog.breaks,
        physicalActivityMinutes: savedLog.physicalActivityMinutes,
        mood: moodToRating(savedLog.mood),
        moodLabel: savedLog.mood,
        privateNotes: savedLog.reflection,
        isAutoTracked: savedLog.syncMode === "auto",
      },
    });
  } catch (error: any) {
    console.error("POST /api/logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save log." },
      { status: 500 }
    );
  }
}
