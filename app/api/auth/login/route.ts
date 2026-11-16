import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    await connectToDatabase();

    // Check if user already exists
    let user = await User.findOne({ username: cleanUsername });

    if (!user) {
      // Auto-register new student handle (Zero-PII architecture)
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        username: cleanUsername,
        passwordHash,
      });

      return NextResponse.json({
        success: true,
        message: "Student account created successfully.",
        user: {
          id: user._id.toString(),
          username: user.username,
        },
      });
    }

    // Verify existing user password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid password for this student handle." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error during authentication.",
      },
      { status: 500 }
    );
  }
}
