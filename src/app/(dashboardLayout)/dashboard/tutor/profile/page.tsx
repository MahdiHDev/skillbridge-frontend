// app/dashboard/tutor/profile/page.tsx
"use client";

import { useTutorProfile } from "@/hooks/use-Tutor";
import { tutorService } from "@/services/tutor.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, Pencil, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TutorProfilePage() {
    const queryClient = useQueryClient();
    const { data: profileData, isLoading } = useTutorProfile();
    const profile = profileData?.data;

    const [bio, setBio] = useState("");

    useEffect(() => {
        if (profile?.bio) setBio(profile.bio);
    }, [profile?.bio]);

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: (bio: string) =>
            tutorService.updateTutorProfile({
                tutorProfileId: profile?.id,
                bio,
            }),
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });

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
            label: "Pending",
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
            <div className="max-w-3xl mx-auto px-4 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your public tutor profile
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {
                            label: "Avg Rating",
                            value: profile?.averageRating?.toFixed(1) ?? "—",
                        },
                        {
                            label: "Total Reviews",
                            value: profile?.totalReviews ?? 0,
                        },
                        {
                            label: "Subjects",
                            value: profile?.tutorCategories?.length ?? 0,
                        },
                        {
                            label: "Verified",
                            value: profile?.isVerified ? "Yes" : "No",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="border rounded-xl p-4 bg-white dark:bg-[#141414] space-y-1"
                        >
                            <p className="text-xs text-muted-foreground">
                                {stat.label}
                            </p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Form Card */}
                <div className="border rounded-xl bg-white dark:bg-[#141414] divide-y divide-border">
                    {/* Account info (read-only) */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <User size={15} className="text-muted-foreground" />
                            <h2 className="text-sm font-semibold">
                                Account Info
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">
                                    Name
                                </label>
                                <p className="text-sm font-medium border rounded-lg px-3 py-2 bg-muted/40">
                                    {profile?.user?.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">
                                    Email
                                </label>
                                <p className="text-sm font-medium border rounded-lg px-3 py-2 bg-muted/40">
                                    {profile?.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">
                                    Profile Status
                                </label>
                                <div
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${currentStatus.class}`}
                                >
                                    {currentStatus.icon}
                                    {currentStatus.label}
                                </div>
                            </div>

                            {profile?.isVerified && (
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">
                                        Verification
                                    </label>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        <ShieldCheck size={13} />
                                        Verified Tutor
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio (editable) */}
                    <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <Pencil
                                size={15}
                                className="text-muted-foreground"
                            />
                            <h2 className="text-sm font-semibold">Bio</h2>
                        </div>

                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={5}
                            placeholder="Tell students about yourself, your experience, and teaching style..."
                            className="w-full text-sm border rounded-lg px-3 py-2.5 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />

                        <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                                {bio.length} characters
                            </p>
                            <button
                                onClick={() => updateProfile(bio)}
                                disabled={
                                    isPending || bio === (profile?.bio ?? "")
                                }
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subjects (read-only list) */}
                {profile?.tutorCategories?.length > 0 && (
                    <div className="border rounded-xl bg-white dark:bg-[#141414] p-6 space-y-4">
                        <h2 className="text-sm font-semibold">
                            Subjects You Teach
                        </h2>
                        <div className="space-y-3">
                            {profile.tutorCategories.map((cat: any) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between text-sm border rounded-lg px-4 py-3"
                                >
                                    <div className="space-y-0.5">
                                        <p className="font-medium capitalize">
                                            {cat.subject.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {cat.level} · {cat.experienceYears}{" "}
                                            yr
                                            {cat.experienceYears !== 1
                                                ? "s"
                                                : ""}{" "}
                                            exp
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            ${cat.hourlyRate}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                /hr
                                            </span>
                                        </p>
                                        {cat.isPrimary && (
                                            <span className="text-xs text-primary font-medium">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
