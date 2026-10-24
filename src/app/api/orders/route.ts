import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

async function getToken() {
  const sessionHeaders = await headers();
  const result = await auth.api.getToken({ headers: sessionHeaders });
  if (!result) return null;
  if (typeof result === "string") return result;
  if (typeof result === "object" && "token" in result && typeof result.token === "string") {
    return result.token;
  }
  return null;
}

/** GET /api/orders — list orders for authenticated user */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const qs = searchParams.toString();

    const response = await fetch(
      `${SERVER_URL}/api/v1/orders${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders." }, { status: 500 });
  }
}

/** POST /api/orders — place a new COD order */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/orders`, {
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
    console.error("Error placing order:", error);
    return NextResponse.json({ success: false, message: "Failed to place order." }, { status: 500 });
  }
}
