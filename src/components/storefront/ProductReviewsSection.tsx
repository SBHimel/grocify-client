"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, Trash2, Loader2, MessageSquarePlus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ProductReview } from "@/types";
import { authClient } from "@/lib/auth-client";
import { submitProductReview, deleteProductReview } from "@/lib/api/reviews";

interface ProductReviewsSectionProps {
  productId: string;
  initialReviews: ProductReview[];
  productRating?: number;
  productReviewCount?: number;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  initialReviews = [],
  productRating = 5.0,
  productReviewCount = 0,
}) => {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // User review status
  const userExistingReview = currentUser
    ? reviews.find((r) => r.userId === currentUser.id)
    : null;

  // Compute breakdown stats
  const totalCount = reviews.length > 0 ? reviews.length : productReviewCount;
  const computedAverage =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : productRating;

  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to submit a review.");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Review comment must be at least 5 characters.");
      return;
    }

    if (comment.trim().length > 1000) {
      toast.error("Review comment must not exceed 1000 characters.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting verified review...");

    try {
      const res = await submitProductReview(productId, {
        rating: selectedRating,
        comment: comment.trim(),
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to submit review.");
      }

      toast.success("Thank you! Your review has been published.", { id: toastId });
      setReviews((prev) => [res.data!, ...prev]);
      setComment("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error submitting review.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    const toastId = toast.loading("Deleting review...");

    try {
      const res = await deleteProductReview(productId, reviewId);
      if (!res.success) {
        throw new Error(res.message || "Failed to delete review.");
      }

      toast.success("Review deleted successfully.", { id: toastId });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error deleting review.";
      toast.error(msg, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const isModerator =
    (currentUser as any)?.role === "owner" || (currentUser as any)?.role === "manager";

  return (
    <section className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-[#e5dbc7]/80">
      <div className="space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Customer Reviews & Ratings
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Read real thoughts from verified purchasers or share your own taste notes.
            </p>
          </div>
        </div>

        {/* Rating Breakdown Summary Card */}
        <div className="bg-[#fdfbf7] border border-[#e5dbc7] rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Big Score */}
            <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#e5dbc7]/70 pb-6 md:pb-0 md:pr-8">
              <div className="text-5xl font-black text-[#14532D]">
                {computedAverage.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(computedAverage)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-600">
                Based on {totalCount} {totalCount === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Star Distribution Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((ratingVal) => {
                const count = ratingCounts[ratingVal] || 0;
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={ratingVal} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-gray-700 shrink-0">
                      {ratingVal} Stars
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-200/80 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-gray-400 font-mono text-[11px] shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review Submission Form / Status */}
        <div className="bg-white border border-[#e5dbc7] rounded-3xl p-6 sm:p-8 shadow-xs">
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center sm:text-left">
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Have you enjoyed this fresh produce?
                </h3>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Sign in with your Grocify account to rate quality and leave helpful feedback.
                </p>
              </div>
              <Link
                href={`/login?callbackUrl=/products/${productId}`}
                className="shrink-0 inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                Sign In to Review
              </Link>
            </div>
          ) : userExistingReview ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">You reviewed this grocery item:</span> &ldquo;
                {userExistingReview.comment}&rdquo; ({userExistingReview.rating} ★). Thank you for helping our farm community!
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-gray-900">
                  Write a Verified Review
                </h3>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled =
                      hoverRating > 0 ? star <= hoverRating : star <= selectedRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-100 text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {hoverRating > 0 ? hoverRating : selectedRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Text Input */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <label htmlFor="review-comment">Review Comments</label>
                  <span className="text-gray-400 font-normal">
                    {comment.length} / 1000 characters
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the freshness, flavor, aroma, packaging, or delivery experience..."
                  maxLength={1000}
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#e5dbc7] focus:outline-none focus:ring-2 focus:ring-[#14532D] bg-[#fdfbf7] placeholder-gray-400 transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || comment.trim().length < 5}
                  className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            All Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#e5dbc7] p-6">
              <p className="text-xs text-gray-400">
                No customer reviews posted yet. Be the first to share your thoughts on this fresh item!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => {
                const dateStr = new Date(rev.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const isAuthor = currentUser?.id === rev.userId;
                const canDelete = isModerator || isAuthor;

                return (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-[#e5dbc7] shadow-2xs hover:border-[#cbd5e1] transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                          {rev.userName ? rev.userName[0] : "C"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">
                              {rev.userName || "Verified Buyer"}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                              Verified
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Moderation / Delete Button */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(rev.id)}
                            disabled={deletingId === rev.id}
                            title="Delete review"
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === rev.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed pl-10.5">
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
