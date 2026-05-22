// app/dashboard/admin/page.tsx
"use client";

import { useTutors } from "@/hooks/use-Tutor";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

const useAdminStats = () => {
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data } = await apiClient.get("/admin/getAllUsers");
            return data;
        },
    });

    const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
        queryKey: ["admin-bookings"],
        queryFn: async () => {
            const { data } = await apiClient.get("/admin/getAllBookings");
            return data;
        },
    });

    // const { data: tutorsData, isLoading: tutorsLoading } = useQuery({
    //     queryKey: ["admin-pending-tutors"],
    //     queryFn: async () => {
    //         const { data } = await apiClient.get("/tutor/getAllTutors/admin", {
    //             params: { status: "PENDING" },
    //         });
    //         return data;
    //     },
    // });

    const { data: tutorsData, isLoading: tutorsLoading } = useTutors({
        status: "PENDING",
    });

    console.log("tutorsdata", tutorsData);

    return {
        users: usersData?.data ?? [],
        bookings: bookingsData?.data ?? [],
        pendingTutors: tutorsData?.data?.data ?? [],
        isLoading: usersLoading || bookingsLoading || tutorsLoading,
    };
};

export default function AdminDashboardPage() {
    const { users, bookings, pendingTutors, isLoading } = useAdminStats();

    if (isLoading) {
        return (
            <div className="py-20">
                <p className="text-center text-gray-500 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    const totalStudents = users.filter(
        (u: any) => u?.role === "STUDENT",
    ).length;
    const totalTutors = users.filter((u: any) => u?.role === "TUTOR").length;
    const bannedUsers = users.filter((u: any) => u?.status === "BANNED").length;

    const stats = [
        {
            icon: <Users size={16} className="text-blue-500" />,
            label: "Total Users",
            value: users.length,
            href: "/dashboard/admin/users",
        },
        {
            icon: <ShieldCheck size={16} className="text-purple-500" />,
            label: "Total Tutors",
            value: totalTutors,
            href: "/dashboard/admin/tutors",
        },
        {
            icon: <BookOpen size={16} className="text-emerald-500" />,
            label: "Total Bookings",
            value: bookings.length,
            href: "/dashboard/admin/bookings",
        },
        {
            icon: <Clock size={16} className="text-yellow-500" />,
            label: "Pending Approvals",
            value: pendingTutors.length,
            href: "/dashboard/admin/tutors",
        },
    ];

    return (
        <section className="py-10">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Platform overview
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="border rounded-xl p-4 bg-white dark:bg-[#141414] space-y-2 hover:border-primary/50 transition-colors"
                        >
                            {stat.icon}
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">
                                {stat.label}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Pending Tutor Approvals */}
                    <div className="border rounded-xl bg-white dark:bg-[#141414] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">
                                Pending Approvals
                            </h2>
                            <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                                {pendingTutors.length} pending
                            </span>
                        </div>

                        <div className="space-y-2">
                            {pendingTutors.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No pending approvals
                                </p>
                            ) : (
                                pendingTutors.slice(0, 4).map((tutor: any) => (
                                    <div
                                        key={tutor.id}
                                        className="flex items-center justify-between text-sm border rounded-lg px-3 py-2.5"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {tutor.user?.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {tutor.user?.email}
                                            </p>
                                        </div>
                                        <Clock
                                            size={14}
                                            className="text-yellow-500"
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        {pendingTutors.length > 4 && (
                            <Link
                                href="/dashboard/admin/tutors"
                                className="text-xs text-primary hover:underline"
                            >
                                View all {pendingTutors.length} pending →
                            </Link>
                        )}
                    </div>

                    {/* User Breakdown */}
                    <div className="border rounded-xl bg-white dark:bg-[#141414] p-6 space-y-4">
                        <h2 className="text-sm font-semibold">
                            User Breakdown
                        </h2>

                        <div className="space-y-3">
                            {[
                                {
                                    label: "Students",
                                    value: totalStudents,
                                    color: "bg-blue-500",
                                    total: users.length,
                                },
                                {
                                    label: "Tutors",
                                    value: totalTutors,
                                    color: "bg-purple-500",
                                    total: users.length,
                                },
                                {
                                    label: "Banned",
                                    value: bannedUsers,
                                    color: "bg-red-500",
                                    total: users.length,
                                },
                            ].map((item) => (
                                <div key={item.label} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            {item.label}
                                        </span>
                                        <span className="font-medium">
                                            {item.value}
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{
                                                width:
                                                    item.total > 0
                                                        ? `${(item.value / item.total) * 100}%`
                                                        : "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/dashboard/admin/users"
                            className="text-xs text-primary hover:underline"
                        >
                            Manage users →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
