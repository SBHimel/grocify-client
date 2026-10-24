import { NextRequest, NextResponse } from "next/server";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * Proxy POST endpoint for Grocify AI Shopping Assistant chat.
 * Directs traffic to the Express backend without exposing API keys or internal infrastructure.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error communicating with Grocify AI service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "The AI assistant service is currently unreachable. Please try again in a few moments.",
      },
      { status: 503 }
    );
  }
}
