// app/dashboard/student/upcoming/page.tsx
"use client";

import { useUpcomingSessions } from "@/hooks/use-Booking";
import { formatDate } from "@/lib/dateFormat";
import { TweleveFormatTime } from "@/lib/formatTime";

export default function UpcomingSessionsPage() {
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
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 space-y-8">
                <h1 className="text-3xl font-bold text-center">
                    Upcoming Sessions
                </h1>

                {sessions.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No upcoming sessions
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="border rounded-xl p-6 space-y-4 shadow-sm bg-white dark:bg-[#141414]"
                            >
                                {/* Subject */}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Subject
                                    </p>
                                    <p className="font-semibold">
                                        {session.tutorCategory.subject.name}
                                    </p>
                                </div>

                                {/* Level */}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Level
                                    </p>
                                    <p className="font-semibold">
                                        {session.tutorCategory.level}
                                    </p>
                                </div>

                                {/* Date + Time */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-gray-500">Date</p>
                                        <p>{formatDate(session.sessionDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Time</p>
                                        <p>
                                            {TweleveFormatTime(
                                                session.startTime,
                                            )}{" "}
                                            -{" "}
                                            {TweleveFormatTime(session.endTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Price + Status */}
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">
                                        ${session.price}
                                    </p>
                                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                        {session.status}
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
                                    <p className="text-center text-sm text-gray-500">
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
