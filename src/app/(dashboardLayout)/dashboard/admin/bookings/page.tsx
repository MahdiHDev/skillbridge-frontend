// app/admin/bookings/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBookings } from "@/hooks/use-Booking";
import { formatDate } from "@/lib/dateFormat";
import { TweleveFormatTime } from "@/lib/formatTime";

import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
};

const LEVEL_COLORS: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-blue-100 text-blue-700",
    ADVANCED: "bg-purple-100 text-purple-700",
};

// function formatTime(iso: string) {
//     return new Date(iso).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// }

// function formatDate(iso: string) {
//     return new Date(iso).toLocaleDateString([], {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//     });
// }

export default function BookingsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useBookings({
        page,
        limit,
        status: status || undefined,
        sortBy,
        sortOrder,
    });

    const bookings = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? 0;
    const totalPages = data?.data?.pagination?.totalPages ?? 1;

    const filtered = search
        ? bookings.filter(
              (b) =>
                  b.student.name.toLowerCase().includes(search.toLowerCase()) ||
                  b.student.email
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                  b.tutorCategory.subject.name
                      .toLowerCase()
                      .includes(search.toLowerCase()),
          )
        : bookings;

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Bookings</h1>
                        <p className="text-sm text-muted-foreground">
                            {total} total bookings
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search student, email, subject..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="price">Sort by Price</option>
                        <option value="sessionDate">Sort by Session</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value as "asc" | "desc")
                        }
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>

                    {(search || status) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setPage(1);
                            }}
                            className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Table */}
                {isLoading ? (
                    <p className="text-center text-muted-foreground py-20 animate-pulse">
                        Loading bookings...
                    </p>
                ) : isError ? (
                    <p className="text-center text-red-500 py-20">
                        Failed to load bookings.
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No bookings found.
                    </p>
                ) : (
                    // Replace the table section

                    <div className="border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[900px]">
                                <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-left">
                                    <tr>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Student
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Tutor
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Subject
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Level
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Date
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Time
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Price
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-3 py-3 font-medium text-muted-foreground">
                                            Meet
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            {/* Student */}
                                            <td className="px-3 py-3 max-w-[140px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-stone-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {booking.student.name?.charAt(
                                                            0,
                                                        ) ?? "?"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium leading-tight truncate">
                                                            {
                                                                booking.student
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {
                                                                booking.student
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Tutor */}
                                            <td className="px-3 py-3 max-w-[140px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-stone-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {booking.tutorCategory.tutorProfile.user.name?.charAt(
                                                            0,
                                                        ) ?? "?"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium leading-tight truncate">
                                                            {
                                                                booking
                                                                    .tutorCategory
                                                                    .tutorProfile
                                                                    .user.name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {
                                                                booking
                                                                    .tutorCategory
                                                                    .tutorProfile
                                                                    .user.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-3 py-3 max-w-[120px]">
                                                <p className="font-medium truncate">
                                                    {
                                                        booking.tutorCategory
                                                            .subject.name
                                                    }
                                                </p>
                                            </td>

                                            {/* Level */}
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${LEVEL_COLORS[booking.tutorCategory.level] ?? "bg-gray-100 text-gray-700"}`}
                                                >
                                                    {
                                                        booking.tutorCategory
                                                            .level
                                                    }
                                                </span>
                                            </td>

                                            {/* Session Date */}
                                            <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                                                {formatDate(
                                                    booking.sessionDate,
                                                )}
                                            </td>

                                            {/* Time */}
                                            <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                                                {TweleveFormatTime(
                                                    booking.startTime,
                                                )}{" "}
                                                –{" "}
                                                {TweleveFormatTime(
                                                    booking.endTime,
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="px-3 py-3 font-semibold whitespace-nowrap">
                                                ${booking.price}
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-700"}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>

                                            {/* Meeting Link */}
                                            <td className="px-3 py-3">
                                                {booking.meetingLink ? (
                                                    <a
                                                        href={
                                                            booking.meetingLink
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-500 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                                                    >
                                                        Join
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Results per page
                        </span>
                        <Select
                            value={String(limit)}
                            onValueChange={(value) => {
                                setLimit(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((opt) => (
                                    <SelectItem key={opt} value={String(opt)}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{totalPages}</span>
                        </span>
                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
