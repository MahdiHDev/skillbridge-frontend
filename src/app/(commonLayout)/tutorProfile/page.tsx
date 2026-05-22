"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorProfile } from "@/hooks/use-Tutor";
import { formatDate } from "@/lib/dateFormat";
import {
    BookOpen,
    CheckCircle,
    Clock,
    Mail,
    Plus,
    Star,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";

export default function TutorProfilePage() {
    const { data, isLoading } = useTutorProfile();
    const profile = data?.data;

    if (isLoading) {
        return (
            <div className="py-10 max-w-4xl mx-auto px-4 space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="py-20 text-center space-y-4">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">
                    No tutor profile found
                </h2>
                <p className="text-muted-foreground">
                    You haven't applied to become a tutor yet.
                </p>
                <Button asChild>
                    <Link href="/be-a-tutor">Apply Now</Link>
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                        <CheckCircle className="h-3 w-3" /> Approved
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                        <Clock className="h-3 w-3" /> Pending Review
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                        <XCircle className="h-3 w-3" /> Rejected
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <section className="py-10">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Tutor Profile</h1>
                    {profile.status === "APPROVED" && (
                        <Button asChild>
                            <Link href="/dashboard/tutor/availability">
                                Manage Availability
                            </Link>
                        </Button>
                    )}
                </div>

                {/* PROFILE CARD */}
                <Card className="dark:bg-[#1e1e22]">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* AVATAR */}
                            <div className="h-20 w-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shrink-0">
                                {profile.user.name.charAt(0)}
                            </div>

                            {/* INFO */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-semibold">
                                        {profile.user.name}
                                    </h2>
                                    {getStatusBadge(profile.status)}
                                    {profile.isVerified && (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        {profile.user.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {profile.user.role}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                        {profile.averageRating} (
                                        {profile.totalReviews} reviews)
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        Joined {formatDate(profile.createdAt)}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {profile.bio}
                                </p>
                            </div>
                        </div>

                        {/* PENDING NOTICE */}
                        {profile.status === "PENDING" && (
                            <div className="mt-6 flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                                <Clock className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                                <p className="text-yellow-700 dark:text-yellow-400">
                                    Your profile is under review. You'll receive
                                    an email once it's approved. This usually
                                    takes 24-48 hours.
                                </p>
                            </div>
                        )}

                        {/* REJECTED NOTICE */}
                        {profile.status === "REJECTED" && (
                            <div className="mt-6 flex gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-sm">
                                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <div className="text-red-700 dark:text-red-400 space-y-1">
                                    <p>
                                        Your tutor profile application was
                                        rejected.
                                    </p>
                                    <p>
                                        Please contact support for more
                                        information.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SUBJECTS */}
                {profile.status === "APPROVED" && (
                    <Card className="dark:bg-[#1e1e22]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">
                                Teaching Subjects
                            </CardTitle>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/dashboard/tutor/categories/create">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Subject
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {profile.tutorCategories.length === 0 ? (
                                <div className="text-center py-8 space-y-3">
                                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground text-sm">
                                        No subjects added yet.
                                    </p>
                                    <Button asChild size="sm">
                                        <Link href="/dashboard/tutor/categories/create">
                                            Add your first subject
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {profile.tutorCategories.map((cat: any) => (
                                        <div
                                            key={cat.id}
                                            className="border rounded-xl p-4 space-y-3 dark:bg-[#141414]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {cat.subject.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {cat.level} ·{" "}
                                                        {cat.experienceYears}{" "}
                                                        yrs exp
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold shrink-0">
                                                    ${cat.hourlyRate}/hr
                                                </p>
                                            </div>

                                            {cat.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {cat.description}
                                                </p>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full text-xs"
                                                >
                                                    <Link
                                                        // href={`/dashboard/tutor/categories/${cat.id}/edit`}
                                                        href={`http://localhost:3000/dashboard/tutor/sessions/${cat.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
