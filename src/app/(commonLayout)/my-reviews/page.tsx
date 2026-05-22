"use client";

import { useDeleteReview, useMyReviews } from "@/hooks/useReview";
import { formatDate } from "@/lib/dateFormat";
import { useState } from "react";
import { toast } from "sonner";

export default function MyReviewsPage() {
    const { data: reviewsData, isLoading } = useMyReviews();
    const { mutateAsync: deleteReview, isPending: isDeleting } =
        useDeleteReview();
    const reviews: any[] = reviewsData?.data ?? [];

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const handleDelete = async (reviewId: string) => {
        setDeletingId(reviewId);
        try {
            await deleteReview(reviewId);
            toast.success("Review deleted successfully!");
        } catch (err) {
            toast.error("Failed to delete review.");
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    };

    const renderStars = (rating: number) => (
        <span className="text-yellow-500 text-base tracking-tight">
            {"★".repeat(rating)}
            <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
        </span>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400 text-sm animate-pulse">
                    Loading your reviews...
                </p>
            </div>
        );
    }

    return (
        <section className="py-20 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">My Reviews</h1>
                    <p className="text-muted-foreground text-sm">
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}{" "}
                        submitted
                    </p>
                </div>

                {/* Empty state */}
                {reviews.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-4xl mb-4">📭</p>
                        <p>You haven&apos;t submitted any reviews yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border rounded-xl p-6 bg-white dark:bg-[#141414] shadow-sm space-y-4"
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        {/* Subject */}
                                        <p className="font-semibold text-base">
                                            {review.booking?.tutorCategory
                                                ?.subject?.name ?? "—"}
                                        </p>
                                        {/* Tutor bio snippet / rating */}
                                        <div className="flex items-center gap-3">
                                            {renderStars(review.rating)}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete button */}
                                    {confirmId === review.id ? (
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() =>
                                                    handleDelete(review.id)
                                                }
                                                disabled={
                                                    deletingId === review.id
                                                }
                                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                                            >
                                                {deletingId === review.id
                                                    ? "Deleting..."
                                                    : "Confirm"}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setConfirmId(null)
                                                }
                                                className="text-xs border px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-stone-800 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setConfirmId(review.id)
                                            }
                                            className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 shrink-0 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {/* Comment */}
                                <p className="text-sm text-gray-600 dark:text-gray-300 border-l-2 border-gray-200 dark:border-stone-700 pl-3 italic">
                                    &quot;{review.comment}&quot;
                                </p>

                                {/* Bottom meta */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                    <span>
                                        Session:{" "}
                                        <span className="font-medium text-foreground">
                                            {formatDate(
                                                review.booking?.sessionDate,
                                            )}
                                        </span>
                                    </span>
                                    <span>
                                        Price:{" "}
                                        <span className="font-medium text-foreground">
                                            ${review.booking?.price}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
