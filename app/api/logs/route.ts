import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import User from "@/models/User";
import mongoose from "mongoose";

async function getAuthUserId(req: NextRequest): Promise<mongoose.Types.ObjectId | null> {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const rawId = (session.user as any).id;
    if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
      return new mongoose.Types.ObjectId(rawId);
    }
    const username = (session.user as any).username || session.user.name;
    if (username) {
      await connectToDatabase();
      const user = await User.findOne({ username: username.toLowerCase() });
      if (user) return user._id as mongoose.Types.ObjectId;
    }
  }

  // Optional header fallback for testing
  const fallbackHeader = req.headers.get("x-user-id");
  if (fallbackHeader && mongoose.Types.ObjectId.isValid(fallbackHeader)) {
    return new mongoose.Types.ObjectId(fallbackHeader);
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to view your logs." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Sorted by date descending as required
    const logs = await DailyLog.find({ userId }).sort({ date: -1 }).lean();

    return NextResponse.json({
      success: true,
      logs: logs.map((log: any) => ({
        id: log._id.toString(),
        userId: log.userId.toString(),
        date: log.date,
        moodScore: log.moodScore ?? 7,
        stressLevel: log.stressLevel ?? 3,
        sleepHours: log.sleepHours ?? 7.5,
        screenTimeMinutes: log.screenTimeMinutes ?? Math.round((log.screenTimeHours || 0) * 60),
        notes: log.notes || log.reflection || "",
        // Rich metrics for UI dashboard & charts
        dayLabel: log.dayLabel || log.date,
        screenTimeHours: log.screenTimeHours ?? +(log.screenTimeMinutes / 60).toFixed(1),
        socialMediaHours: log.socialMediaHours ?? 1.2,
        gamingHours: log.gamingHours ?? 0.5,
        studyHours: log.studyHours ?? 4.5,
        breaksCount: log.breaksCount ?? 5,
        physicalActivityMinutes: log.physicalActivityMinutes ?? 30,
        mood: log.mood || "Neutral",
        syncMode: log.syncMode || "manual",
        createdAt: log.createdAt,
      })),
      count: logs.length,
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
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to save your logs." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const todayStr = new Date().toISOString().split("T")[0];
    const date = body.date || todayStr;

    await connectToDatabase();

    const screenTimeHours = Number(body.screenTimeHours ?? (body.screenTimeMinutes ? body.screenTimeMinutes / 60 : 4.8));
    const screenTimeMinutes = Number(body.screenTimeMinutes ?? Math.round(screenTimeHours * 60));
    const sleepHours = Number(body.sleepHours ?? 7.5);
    const moodScore = Number(body.moodScore ?? (body.mood === "Positive" ? 8 : body.mood === "Negative" ? 4 : body.mood === "Depressed" ? 2 : 6));
    const stressLevel = Number(body.stressLevel ?? (moodScore <= 4 ? 8 : moodScore <= 6 ? 5 : 2));
    const notes = String(body.notes || body.privateNotes || body.reflection || "");

    const updateDoc = {
      userId,
      date,
      moodScore,
      stressLevel,
      sleepHours,
      screenTimeMinutes,
      notes,
      dayLabel: body.dayLabel || "Today",
      screenTimeHours,
      socialMediaHours: Number(body.socialMediaHours ?? 1.2),
      gamingHours: Number(body.gamingHours ?? 0.5),
      studyHours: Number(body.studyHours ?? 4.5),
      breaksCount: Number(body.breaksCount ?? 5),
      physicalActivityMinutes: Number(body.physicalActivityMinutes ?? 30),
      mood: body.mood || "Neutral",
      syncMode: body.syncMode || (body.isAutoTracked ? "auto" : "manual"),
    };

    const savedLog = await DailyLog.findOneAndUpdate(
      { userId, date },
      updateDoc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Daily wellbeing log saved to MongoDB.",
      log: {
        id: savedLog._id.toString(),
        userId: savedLog.userId.toString(),
        date: savedLog.date,
        moodScore: savedLog.moodScore,
        stressLevel: savedLog.stressLevel,
        sleepHours: savedLog.sleepHours,
        screenTimeMinutes: savedLog.screenTimeMinutes,
        notes: savedLog.notes,
        dayLabel: savedLog.dayLabel,
        screenTimeHours: savedLog.screenTimeHours,
        socialMediaHours: savedLog.socialMediaHours,
        gamingHours: savedLog.gamingHours,
        studyHours: savedLog.studyHours,
        breaksCount: savedLog.breaksCount,
        physicalActivityMinutes: savedLog.physicalActivityMinutes,
        mood: savedLog.mood,
        syncMode: savedLog.syncMode,
        createdAt: savedLog.createdAt,
      },
    });
  } catch (error: any) {
    console.error("POST /api/logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save daily log." },
      { status: 500 }
    );
  }
}
