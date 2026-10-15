import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * PATCH /api/users/profile
 * Allows any authenticated user to update their own name and image.
 * Persists to MongoDB via Express API using verified JWT.
 */
export async function PATCH(req: NextRequest) {
  try {
    const sessionHeaders = await headers();
    const result = await auth.api.getToken({
      headers: sessionHeaders,
    });

    const token =
      typeof result === "string"
        ? result
        : typeof result === "object" && result && "token" in result && typeof result.token === "string"
        ? result.token
        : null;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required to update profile." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating user profile via proxy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to communicate with profile service." },
      { status: 500 }
    );
  }
}
