// app/dashboard/tutor/reviews/page.tsx
"use client";

import { useTutorProfile } from "@/hooks/use-Tutor";
import { useDeleteReview, useGetReviews } from "@/hooks/useReview";
import { formatDate } from "@/lib/dateFormat";
import { Star, Trash2 } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={
                        star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
}

export default function MyReviewsPage() {
    const { data: profileData, isLoading: profileLoading } = useTutorProfile();
    const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
    const tutorProfileId = profileData?.data?.id;

    const { data, isLoading: reviewsLoading } = useGetReviews(tutorProfileId!);
    const reviews = data?.data ?? [];

    if (profileLoading || reviewsLoading) {
        return (
            <div className="py-20">
                <p className="text-center text-gray-500 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <section className="py-10">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">My Reviews</h1>
                    <p className="text-sm text-muted-foreground">
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No reviews yet
                    </p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border rounded-xl p-6 space-y-3 bg-white dark:bg-[#141414]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-stone-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                            {review.student.name?.charAt(0) ??
                                                "?"}
                                        </div>
                                        <p className="font-medium text-sm">
                                            {review.student.name}
                                        </p>
                                    </div>

                                    {/* date + delete */}
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(review.createdAt)}
                                        </p>
                                        <button
                                            onClick={() =>
                                                deleteReview(review.id)
                                            }
                                            disabled={isDeleting}
                                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <StarRating rating={review.rating} />

                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
