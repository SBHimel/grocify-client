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

/** GET /api/orders/[id] */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const response = await fetch(`${SERVER_URL}/api/v1/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch order." }, { status: 500 });
  }
}

/** PATCH /api/orders/[id] — update order status (owner/manager) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/orders/${id}/status`, {
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
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, message: "Failed to update order." }, { status: 500 });
  }
}
