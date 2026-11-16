import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import HabitRecord from "@/models/HabitRecord";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous_student";
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    await connectToDatabase();

    // Fetch today's record and recent records to compute/verify streak
    const todayRecord = await HabitRecord.findOne({ userId, date }).lean();
    const allRecords = await HabitRecord.find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    // Calculate active streak count
    let streak = todayRecord?.streakCount || 0;
    if (!streak && allRecords.length > 0) {
      streak = allRecords[0].streakCount || allRecords.length;
    }

    return NextResponse.json({
      success: true,
      record: todayRecord || {
        userId,
        date,
        completedHabitIds: [],
        streakCount: streak,
      },
      streakCount: streak,
      recentRecords: allRecords,
    });
  } catch (error: any) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch habits." },
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
      completedHabitIds = [],
      streakCount = 0,
    } = body;

    await connectToDatabase();

    // Ensure IDs are stored as strings
    const stringIds = Array.isArray(completedHabitIds)
      ? completedHabitIds.map(String)
      : [];

    const updatedRecord = await HabitRecord.findOneAndUpdate(
      { userId, date },
      {
        userId,
        date,
        completedHabitIds: stringIds,
        streakCount: Number(streakCount),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Habit record updated in MongoDB.",
      record: {
        id: updatedRecord._id.toString(),
        userId: updatedRecord.userId,
        date: updatedRecord.date,
        completedHabitIds: updatedRecord.completedHabitIds,
        streakCount: updatedRecord.streakCount,
      },
    });
  } catch (error: any) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update habits." },
      { status: 500 }
    );
  }
}
