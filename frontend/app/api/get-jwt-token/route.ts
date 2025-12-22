import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get the Better Auth session from request headers
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Create a JWT token manually with the same secret as backend
    const SECRET_KEY = process.env.BETTER_AUTH_SECRET;
    if (!SECRET_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT token with user data
    const token = jwt.sign(
      {
        sub: session.user.id, // Better Auth uses 'sub' for user ID
        email: session.user.email,
        user_id: parseInt(session.user.id), // Also include user_id for compatibility
      },
      SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "7d", // 7 days
      }
    );

    return NextResponse.json({
      token,
      user: session.user,
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
