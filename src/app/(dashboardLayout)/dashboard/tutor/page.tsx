// app/dashboard/tutor/page.tsx
"use client";

import { useTutorProfile } from "@/hooks/use-Tutor";
import { useMyReviews } from "@/hooks/useReview";
import { formatDate } from "@/lib/dateFormat";
import {
    BookOpen,
    CheckCircle,
    Clock,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={12}
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

export default function TutorDashboardPage() {
    const { data: profileData, isLoading } = useTutorProfile();
    const { data: reviewsData } = useMyReviews();

    const profile = profileData?.data;
    const reviews = reviewsData?.data ?? [];
    const recentReviews = reviews.slice(0, 3);

    if (isLoading) {
        return (
            <div className="py-20">
                <p className="text-center text-gray-500 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    const statusConfig = {
        APPROVED: {
            label: "Approved",
            class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            icon: <CheckCircle size={13} />,
        },
        PENDING: {
            label: "Pending Review",
            class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            icon: <Clock size={13} />,
        },
        REJECTED: {
            label: "Rejected",
            class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            icon: <Clock size={13} />,
        },
    };

    const currentStatus =
        statusConfig[profile?.status as keyof typeof statusConfig] ??
        statusConfig.PENDING;

    return (
        <section className="py-10">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Welcome */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Welcome back, {profile?.user?.name?.split(" ")[0]}{" "}
                            👋
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Here's an overview of your tutor profile
                        </p>
                    </div>
                    <div
                        className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${currentStatus.class}`}
                    >
                        {currentStatus.icon}
                        {currentStatus.label}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {
                            icon: (
                                <Star size={16} className="text-yellow-500" />
                            ),
                            label: "Avg Rating",
                            value: profile?.averageRating?.toFixed(1) ?? "—",
                        },
                        {
                            icon: <Users size={16} className="text-blue-500" />,
                            label: "Total Reviews",
                            value: profile?.totalReviews ?? 0,
                        },
                        {
                            icon: (
                                <BookOpen
                                    size={16}
                                    className="text-purple-500"
                                />
                            ),
                            label: "Subjects",
                            value: profile?.tutorCategories?.length ?? 0,
                        },
                        {
                            icon: (
                                <ShieldCheck
                                    size={16}
                                    className="text-emerald-500"
                                />
                            ),
                            label: "Verified",
                            value: profile?.isVerified ? "Yes" : "No",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="border rounded-xl p-4 bg-white dark:bg-[#141414] space-y-2"
                        >
                            {stat.icon}
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Subjects */}
                    <div className="border rounded-xl bg-white dark:bg-[#141414] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Subjects</h2>
                            <TrendingUp
                                size={15}
                                className="text-muted-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            {profile?.tutorCategories?.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No subjects added yet
                                </p>
                            )}
                            {profile?.tutorCategories?.map((cat: any) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between text-sm border rounded-lg px-3 py-2.5"
                                >
                                    <div>
                                        <p className="font-medium capitalize">
                                            {cat.subject.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {cat.level}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        ${cat.hourlyRate}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            /hr
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/dashboard/tutor/profile"
                            className="text-xs text-primary hover:underline"
                        >
                            Manage profile →
                        </Link>
                    </div>

                    {/* Recent Reviews */}
                    <div className="border rounded-xl bg-white dark:bg-[#141414] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">
                                Recent Reviews
                            </h2>
                            <Star size={15} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                            {recentReviews.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No reviews yet
                                </p>
                            )}
                            {recentReviews.map((review: any) => (
                                <div
                                    key={review.id}
                                    className="space-y-1 border rounded-lg px-3 py-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            {review.student.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                    <StarRating rating={review.rating} />
                                    {review.comment && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {reviews.length > 3 && (
                            <Link
                                href="/dashboard/tutor/reviews"
                                className="text-xs text-primary hover:underline"
                            >
                                View all {reviews.length} reviews →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
