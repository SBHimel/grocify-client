import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * DELETE /api/products/[id]/reviews/[reviewId]
 * Authenticated proxy for review moderation.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const { id, reviewId } = await params;
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
    console.error("Error deleting review via parameterized proxy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
