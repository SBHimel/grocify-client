import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * GET /api/products/[id]/reviews
 * Public proxy: returns all reviews for a product.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${SERVER_URL}/api/v1/products/${id}/reviews`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching reviews via proxy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]/reviews
 * Authenticated proxy: submits a review for a product.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        { success: false, message: "Authentication required to submit a review." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${SERVER_URL}/api/v1/products/${id}/reviews`, {
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
    console.error("Error submitting review via proxy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]/reviews?reviewId=...
 * Authenticated proxy for moderation deletion.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: "Review ID is required." },
        { status: 400 }
      );
    }

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
        { success: false, message: "Authentication required to delete a review." },
        { status: 401 }
      );
    }

    const response = await fetch(`${SERVER_URL}/api/v1/products/${id}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting review via proxy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
