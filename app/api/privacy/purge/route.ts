import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import HabitRecord from "@/models/HabitRecord";
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

  const fallbackHeader = req.headers.get("x-user-id");
  if (fallbackHeader && mongoose.Types.ObjectId.isValid(fallbackHeader)) {
    return new mongoose.Types.ObjectId(fallbackHeader);
  }

  return null;
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to purge records." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Permanently delete all DailyLog and HabitRecord documents belonging to the authenticated user
    const [deletedLogs, deletedHabits] = await Promise.all([
      DailyLog.deleteMany({ userId }),
      HabitRecord.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      message: "All student logs and habit records permanently purged from MongoDB.",
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
