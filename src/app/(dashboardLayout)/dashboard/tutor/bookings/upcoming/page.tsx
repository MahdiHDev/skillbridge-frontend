// app/dashboard/tutor/upcoming/page.tsx
"use client";

import { useUpcomingSessions } from "@/hooks/use-Booking";
import { formatDate } from "@/lib/dateFormat";
import { TweleveFormatTime } from "@/lib/formatTime";

export default function TutorUpcomingPage() {
    const { data, isLoading } = useUpcomingSessions();
    const sessions: any[] = data?.data ?? [];

    if (isLoading) {
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
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Upcoming Sessions</h1>
                    <p className="text-sm text-muted-foreground">
                        {sessions.length} confirmed session
                        {sessions.length !== 1 ? "s" : ""} ahead
                    </p>
                </div>

                {sessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No upcoming sessions
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="border rounded-xl p-6 space-y-4 shadow-sm bg-white dark:bg-[#141414]"
                            >
                                {/* Subject */}
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Subject
                                    </p>
                                    <p className="font-semibold">
                                        {session.tutorCategory.subject.name}
                                    </p>
                                </div>

                                {/* Student */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-stone-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                        {session.student?.name?.charAt(0) ??
                                            "?"}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Student
                                        </p>
                                        <p className="font-medium text-sm">
                                            {session.student?.name ?? "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.student?.email ?? "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Date + Time */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Date
                                        </p>
                                        <p>{formatDate(session.sessionDate)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            Time
                                        </p>
                                        <p>
                                            {TweleveFormatTime(
                                                session.startTime,
                                            )}{" "}
                                            –{" "}
                                            {TweleveFormatTime(session.endTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Price + Level */}
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">
                                        ${session.price}
                                    </p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                        {session.tutorCategory.level}
                                    </span>
                                </div>

                                {/* Meeting Link */}
                                {session.meetingLink ? (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center bg-black text-white py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
                                    >
                                        Join Meeting
                                    </a>
                                ) : (
                                    <p className="text-center text-xs text-gray-500 border rounded-md py-2">
                                        No meeting link yet
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
