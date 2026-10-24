import { ProductReview } from "@/types";

const SERVER_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

/**
 * Fetch reviews for a product with graceful fallback.
 * Can be called from Server Components or Client Components.
 */
export async function fetchProductReviews(
  productId: string
): Promise<ProductReview[]> {
  try {
    // If executing in browser, prefer the client proxy route; otherwise direct backend
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser
      ? `/api/products/${productId}/reviews`
      : `${SERVER_URL}/api/v1/products/${productId}/reviews`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    if (Array.isArray(json)) {
      return json;
    }
    return [];
  } catch (error) {
    console.warn(`Failed to fetch reviews for product ${productId}:`, error);
    return [];
  }
}

/**
 * Submit a customer review for a product via Next.js proxy route.
 */
export async function submitProductReview(
  productId: string,
  payload: { rating: number; comment: string }
): Promise<{ success: boolean; data?: ProductReview; message?: string }> {
  try {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    return {
      success: res.ok && json.success,
      data: json.data,
      message: json.message || (res.ok ? "Review submitted successfully!" : "Failed to submit review"),
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Network error submitting review.";
    return {
      success: false,
      message: msg,
    };
  }
}

/**
 * Delete a product review (moderation for owner/manager) via Next.js proxy.
 */
export async function deleteProductReview(
  productId: string,
  reviewId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: "DELETE",
    });

    const json = await res.json();
    return {
      success: res.ok && json.success,
      message: json.message || (res.ok ? "Review deleted successfully." : "Failed to delete review"),
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Network error deleting review.";
    return {
      success: false,
      message: msg,
    };
  }
}
