import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import HabitRecord from "@/models/HabitRecord";

export async function DELETE(req: NextRequest) {
  try {
    let userId: string | null = null;

    // Check query params first
    const { searchParams } = new URL(req.url);
    userId = searchParams.get("userId");

    // Check JSON body if not in query
    if (!userId) {
      try {
        const body = await req.json();
        userId = body.userId;
      } catch {
        // empty body ok
      }
    }

    if (!userId) {
      userId = "anonymous_student";
    }

    await connectToDatabase();

    const [deletedLogs, deletedHabits] = await Promise.all([
      DailyLog.deleteMany({ userId }),
      HabitRecord.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Permanently purged all records from MongoDB for student handle: ${userId}.`,
      purged: {
        logsCount: deletedLogs.deletedCount,
        habitsCount: deletedHabits.deletedCount,
      },
    });
  } catch (error: any) {
    console.error("DELETE /api/privacy/purge error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge database records." },
      { status: 500 }
    );
  }
}
