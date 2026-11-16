import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, authProvider = "credentials", email } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    await connectToDatabase();

    // 1. Google OAuth User Sync
    if (authProvider === "google") {
      let user = await User.findOne({
        $or: [{ username: cleanUsername }, { email: email?.toLowerCase() }],
      });

      if (!user) {
        user = await User.create({
          username: cleanUsername,
          email: email ? email.toLowerCase() : undefined,
          authProvider: "google",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Google account authenticated successfully.",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          authProvider: user.authProvider,
        },
      });
    }

    // 2. Credentials User Login / Auto-Registration (Zero PII architecture)
    let user = await User.findOne({ username: cleanUsername });

    if (user) {
      // Existing user with password
      if (user.passwordHash && password) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Invalid password for this handle." },
            { status: 401 }
          );
        }
      }
    } else {
      // Auto-register new anonymous student handle
      let passwordHash: string | undefined = undefined;
      if (password && password.length >= 4) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      user = await User.create({
        username: cleanUsername,
        passwordHash,
        authProvider: "credentials",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
      },
    });
  } catch (error: any) {
    console.error("Auth login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error during authentication.",
      },
      { status: 500 }
    );
  }
}
