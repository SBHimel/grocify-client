import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * Client-facing POST proxy for creating batches.
 * Attaches the signed Better Auth JWT to the Express API request.
 */
export async function POST(req: NextRequest) {
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
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating inventory batch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to communicate with inventory service." },
      { status: 500 }
    );
  }
}
