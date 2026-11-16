import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
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

function calculateStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;
  const dateSet = new Set(dates);
  const current = new Date();
  const format = (d: Date) => d.toISOString().split("T")[0];

  let checkDate = new Date(current);
  let todayStr = format(checkDate);

  // If not completed today, check if yesterday was completed to keep streak alive
  if (!dateSet.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    if (!dateSet.has(format(checkDate))) {
      return 0;
    }
  }

  let streak = 0;
  while (dateSet.has(format(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}

const DEFAULT_HABITS = [
  {
    title: "Balanced Screen Leisure",
    category: "screen",
    targetFrequency: "daily",
  },
  {
    title: "20-20-20 Eye Rest Breaks",
    category: "screen",
    targetFrequency: "daily",
  },
  {
    title: "Consistent Sleep Wind-Down",
    category: "sleep",
    targetFrequency: "daily",
  },
  {
    title: "Natural Daylight & Outdoor Air",
    category: "body",
    targetFrequency: "daily",
  },
  {
    title: "Physical Activity & Stretching",
    category: "body",
    targetFrequency: "daily",
  },
  {
    title: "Offline Reading / Journaling",
    category: "mind",
    targetFrequency: "daily",
  },
  {
    title: "Mealtime Phone-Free Zone",
    category: "social",
    targetFrequency: "daily",
  },
];

// GET: Fetch all user habits (auto-seed if empty)
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to access habits." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    let habits = await HabitRecord.find({ userId }).sort({ createdAt: 1 });

    // Auto-seed default habits on first access
    if (habits.length === 0) {
      const today = new Date().toISOString().split("T")[0];
      const initialHabits = DEFAULT_HABITS.map((item, idx) => ({
        userId,
        title: item.title,
        category: item.category,
        targetFrequency: item.targetFrequency,
        completedDates: idx < 4 ? [today] : [],
        streak: idx < 4 ? 1 : 0,
      }));

      habits = await HabitRecord.insertMany(initialHabits);
    }

    const todayStr = new Date().toISOString().split("T")[0];

    return NextResponse.json({
      success: true,
      habits: habits.map((h) => ({
        id: h._id.toString(),
        userId: h.userId.toString(),
        title: h.title,
        category: h.category,
        targetFrequency: h.targetFrequency,
        completedDates: h.completedDates,
        completed: h.completedDates.includes(todayStr),
        streak: h.streak,
        createdAt: h.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch habits." },
      { status: 500 }
    );
  }
}

// POST: Create a new habit
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, category = "general", targetFrequency = "daily" } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Habit title is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const habit = await HabitRecord.create({
      userId,
      title: title.trim(),
      category: category.trim().toLowerCase(),
      targetFrequency,
      completedDates: [],
      streak: 0,
    });

    return NextResponse.json({
      success: true,
      message: "New habit created.",
      habit: {
        id: habit._id.toString(),
        userId: habit.userId.toString(),
        title: habit.title,
        category: habit.category,
        targetFrequency: habit.targetFrequency,
        completedDates: habit.completedDates,
        completed: false,
        streak: habit.streak,
        createdAt: habit.createdAt,
      },
    });
  } catch (error: any) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create habit." },
      { status: 500 }
    );
  }
}

// PATCH: Toggle completion for a given date & recalculate streak
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { habitId, date = new Date().toISOString().split("T")[0] } = body;

    if (!habitId) {
      return NextResponse.json(
        { success: false, error: "habitId is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const habit = await HabitRecord.findOne({ _id: habitId, userId });
    if (!habit) {
      return NextResponse.json(
        { success: false, error: "Habit not found." },
        { status: 404 }
      );
    }

    // Toggle date
    const dateIndex = habit.completedDates.indexOf(date);
    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(date);
    }

    // Recalculate streak
    habit.streak = calculateStreak(habit.completedDates);
    await habit.save();

    const todayStr = new Date().toISOString().split("T")[0];

    return NextResponse.json({
      success: true,
      message: "Habit completion toggled.",
      habit: {
        id: habit._id.toString(),
        userId: habit.userId.toString(),
        title: habit.title,
        category: habit.category,
        targetFrequency: habit.targetFrequency,
        completedDates: habit.completedDates,
        completed: habit.completedDates.includes(todayStr),
        streak: habit.streak,
        createdAt: habit.createdAt,
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle habit." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a habit
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let habitId = searchParams.get("id");

    if (!habitId) {
      try {
        const body = await req.json();
        habitId = body.id;
      } catch {
        // empty body
      }
    }

    if (!habitId) {
      return NextResponse.json(
        { success: false, error: "Habit ID is required for deletion." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const result = await HabitRecord.deleteOne({ _id: habitId, userId });

    return NextResponse.json({
      success: true,
      message: "Habit deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete habit." },
      { status: 500 }
    );
  }
}
