"use client";

import React, { useState, useMemo } from "react";
import { ReviewDto, ReviewSummaryDto, ProductVariantDto } from "@/types/product";
import {
  Star,
  CheckCircle2,
  MessageSquarePlus,
  Filter,
  X,
  Sparkles,
  Info,
  ChevronDown,
  Send,
  Loader2,
} from "lucide-react";
import clsx from "clsx";

interface ProductReviewsProps {
  productSlug: string;
  productName: string;
  initialSummary?: ReviewSummaryDto;
  selectedVariant?: ProductVariantDto;
}

export function ProductReviews({
  productSlug,
  productName,
  initialSummary,
  selectedVariant,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryDto>(
    initialSummary || {
      averageRating: 4.8,
      totalReviews: 4,
      ratingDistribution: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 },
    }
  );
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedFromApi, setHasLoadedFromApi] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Review submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formReviewerName, setFormReviewerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews on initial mount or when filter changes
  const fetchReviews = async (ratingFilter?: number | null) => {
    try {
      setIsLoading(true);
      const url =
        ratingFilter !== null && ratingFilter !== undefined
          ? `/api/products/${productSlug}/reviews?rating=${ratingFilter}`
          : `/api/products/${productSlug}/reviews`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReviews(json.data.reviews);
          setSummary(json.data.summary);
        }
      }
    } catch {
      // Graceful fallback on static hosting
    } finally {
      setIsLoading(false);
      setHasLoadedFromApi(true);
    }
  };

  React.useEffect(() => {
    fetchReviews(selectedRatingFilter);
  }, [productSlug, selectedRatingFilter]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formReviewerName.trim() || formReviewerName.trim().length < 2) {
      setFormError("Please enter your name (at least 2 characters)");
      return;
    }
    if (!formTitle.trim() || formTitle.trim().length < 2) {
      setFormError("Please enter a review headline (at least 2 characters)");
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 5) {
      setFormError("Please enter detailed feedback (at least 5 characters)");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: formRating,
          title: formTitle.trim(),
          comment: formComment.trim(),
          reviewerName: formReviewerName.trim(),
          variantName: selectedVariant?.variantName || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setFormError(json.error || "Failed to submit review");
        return;
      }

      // Add to local state & show success
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setFormTitle("");
        setFormComment("");
        setFormReviewerName("");
        fetchReviews(selectedRatingFilter);
      }, 1500);
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered reviews
  const displayedReviews = useMemo(() => {
    if (!selectedRatingFilter) return reviews.slice(0, visibleCount);
    return reviews
      .filter((r) => r.rating === selectedRatingFilter)
      .slice(0, visibleCount);
  }, [reviews, selectedRatingFilter, visibleCount]);

  const totalFilteredCount = selectedRatingFilter
    ? reviews.filter((r) => r.rating === selectedRatingFilter).length
    : reviews.length;

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-xs p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)]">
              <Star className="w-5 h-5 fill-current" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Customer Ratings & Reviews
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-normal">
            Real experiences from verified 1Fi mutual fund backed buyers of {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 text-xs font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white py-2.5 px-5 rounded-xl shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Overview Section: Left Score Card | Right Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center bg-[var(--bg-surface-subtle)] p-6 rounded-2xl border border-[var(--border-subtle)]">
        {/* Left: Score Card (4 Cols) */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-[var(--border-subtle)] md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "5.0"}
            </span>
            <span className="text-sm text-[var(--text-secondary)] font-semibold">/ 5.0</span>
          </div>

          {/* Star Icons */}
          <div className="flex items-center justify-center md:justify-start gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={clsx(
                  "w-4 h-4",
                  star <= Math.round(summary.averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-300 text-gray-300"
                )}
              />
            ))}
          </div>

          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Based on {summary.totalReviews} verified community ratings
          </p>
        </div>

        {/* Right: Star Breakdown Progress Bars (8 Cols) */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution] || 0;
            const pct = summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;
            const isSelected = selectedRatingFilter === stars;

            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  setSelectedRatingFilter(isSelected ? null : stars)
                }
                className={clsx(
                  "w-full flex items-center gap-3 text-xs font-medium py-1.5 px-2.5 rounded-xl transition-colors cursor-pointer group text-left",
                  isSelected
                    ? "bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] font-semibold"
                    : "hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                )}
              >
                <span className="w-12 shrink-0 font-semibold flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                {/* Bar */}
                <div className="flex-1 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={clsx(
                      "h-full rounded-full transition-all duration-300",
                      isSelected ? "bg-[var(--brand-primary)]" : "bg-amber-400 group-hover:bg-amber-500"
                    )}
                  />
                </div>

                <span className="w-14 text-right shrink-0 text-[var(--text-secondary)] text-[11px] tabular-nums">
                  {pct}% ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setSelectedRatingFilter(null)}
            className={clsx(
              "text-xs py-1.5 px-3.5 rounded-full font-semibold transition-all cursor-pointer",
              selectedRatingFilter === null
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]"
            )}
          >
            All Ratings ({summary.totalReviews})
          </button>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.ratingDistribution[star as keyof typeof summary.ratingDistribution] || 0;
            if (count === 0) return null;
            const isSelected = selectedRatingFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setSelectedRatingFilter(isSelected ? null : star)
                }
                className={clsx(
                  "text-xs py-1.5 px-3.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                  isSelected
                    ? "bg-[var(--brand-primary)] text-white shadow-xs"
                    : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]"
                )}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {selectedRatingFilter && (
          <button
            type="button"
            onClick={() => setSelectedRatingFilter(null)}
            className="text-xs text-[var(--brand-primary)] hover:underline font-bold cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-[var(--text-secondary)] flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
            <span className="text-xs">Loading verified customer reviews...</span>
          </div>
        ) : displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 bg-[var(--bg-surface-subtle)]/40 hover:bg-[var(--bg-surface)] transition-all duration-200 space-y-3.5 shadow-xs"
            >
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={clsx(
                          "w-3.5 h-3.5",
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-300 text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {review.rating}.0
                  </span>
                </div>

                {review.verifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2.5 py-1 rounded-md border border-[var(--brand-primary)]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified 1Fi Buyer
                  </span>
                )}
              </div>

              {/* Title & Comment */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {review.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Footer Meta: Reviewer Name, Date, Variant */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {review.reviewerName}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {review.variantName && (
                  <span className="text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] text-[10px] font-medium">
                    Purchased: {review.variantName}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-[var(--bg-surface-subtle)] rounded-2xl border border-[var(--border-subtle)] space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              No reviews found matching {selectedRatingFilter} stars
            </p>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter(null)}
              className="text-xs text-[var(--brand-primary)] font-bold hover:underline cursor-pointer"
            >
              View all reviews
            </button>
          </div>
        )}

        {/* Load More Button */}
        {totalFilteredCount > visibleCount && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="text-xs font-bold text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)] py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
            >
              Load More Reviews ({totalFilteredCount - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Transparency Note */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)]">
        <Info className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
        <span>
          Ratings & feedback from customers who purchased devices using 1Fi mutual fund pledged financing.
        </span>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--bg-surface)] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-scaleUp border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  Write a Review
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Share your experience with {productName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[var(--brand-primary)] mx-auto" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Thank You for Your Review!
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your feedback has been saved and published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    ⚠️ {formError}
                  </div>
                )}

                {/* Rating Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)] block">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`${star} star`}
                      >
                        <Star
                          className={clsx(
                            "w-6 h-6",
                            star <= formRating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-300 text-gray-300"
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[var(--text-primary)] ml-2">
                      {formRating} out of 5
                    </span>
                  </div>
                </div>

                {/* Reviewer Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="reviewer-name"
                    className="text-xs font-semibold text-[var(--text-primary)] block"
                  >
                    Your Name
                  </label>
                  <input
                    id="reviewer-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formReviewerName}
                    onChange={(e) => setFormReviewerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 bg-[var(--bg-surface-subtle)]"
                  />
                </div>

                {/* Review Headline */}
                <div className="space-y-1">
                  <label
                    htmlFor="review-title"
                    className="text-xs font-semibold text-[var(--text-primary)] block"
                  >
                    Review Headline
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    required
                    placeholder="e.g. Seamless mutual fund EMI purchase!"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 bg-[var(--bg-surface-subtle)]"
                  />
                </div>

                {/* Review Content */}
                <div className="space-y-1">
                  <label
                    htmlFor="review-comment"
                    className="text-xs font-semibold text-[var(--text-primary)] block"
                  >
                    Detailed Feedback
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    required
                    placeholder="Describe product quality, delivery experience, and EMI financing..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 bg-[var(--bg-surface-subtle)] resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-70 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
