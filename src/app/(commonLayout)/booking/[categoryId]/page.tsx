"use client";

import { Calendar } from "@/components/ui/calendar";
import { useCreateBooking } from "@/hooks/use-Booking";
import {
    useGetAvailabilityById,
    useGetAvailableDates,
} from "@/hooks/useAvailability";
import { toHHMM, TweleveFormatTime } from "@/lib/formatTime";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const tutorCategoryId = params.categoryId as string;
    const tutorName = searchParams.get("tutorName");
    const subject = searchParams.get("subject");
    const tutorProfileId = searchParams.get("tutorProfileId") as string;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [sessionDate, setSessionDate] = useState("");
    const [filteredSlots, setFilteredSlots] = useState<any[]>([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const { data, isLoading } = useGetAvailabilityById(tutorProfileId);
    const availabilityData: any[] = data?.data ?? [];

    const { data: availableDatesData } = useGetAvailableDates(
        tutorProfileId,
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
    );

    // ✅ data is { success, message, data: string[] }
    const availableDateSet = new Set<string>(
        (availableDatesData?.data ?? []).map(
            (iso: string) => iso.split("T")[0],
        ),
    );

    const { mutateAsync, isPending } = useCreateBooking();

    const formatDateLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // ✅ fixed isDateAvailable — now returns boolean
    const isDateAvailable = (date: Date): boolean => {
        const dateStr = formatDateLocal(date);
        return availableDateSet.has(dateStr);
    };

    const getDayOfWeek = (dateStr: string) => {
        return new Date(`${dateStr}T00:00:00`)
            .toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "Asia/Dhaka",
            })
            .toUpperCase();
    };

    useEffect(() => {
        if (!sessionDate || availabilityData.length === 0) return;

        const selectedDay = getDayOfWeek(sessionDate);

        const filtered = availabilityData.filter((slot) => {
            const slotStartStr = slot.startDate.split("T")[0];
            const slotEndStr = slot.endDate.split("T")[0];

            console.log("comparing:", {
                slotDay: slot.dayOfWeek,
                selectedDay,
                match: slot.dayOfWeek === selectedDay,
                isActive: slot.isActive,
                sessionDate,
                slotStartStr,
                slotEndStr,
                inRange:
                    sessionDate >= slotStartStr && sessionDate <= slotEndStr,
            });

            return (
                slot.isActive &&
                slot.dayOfWeek === selectedDay &&
                sessionDate >= slotStartStr &&
                sessionDate <= slotEndStr
            );
        });

        setFilteredSlots(filtered);
        setStartTime("");
        setEndTime("");
    }, [sessionDate, availabilityData]);

    const handleSubmit = async () => {
        if (!sessionDate || !startTime || !endTime) {
            alert("Please select date and slot");
            return;
        }
        const body = {
            tutorCategoryId,
            sessionDate,
            startTime: toHHMM(startTime),
            endTime: toHHMM(endTime),
        };

        console.log("submit data", body);
        await mutateAsync(body);

        // ✅ VERY IMPORTANT: refresh available dates
        setCurrentMonth(new Date(currentMonth));
    };

    if (isLoading) {
        return (
            <div className="py-20">
                <p className="text-center text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <section className="py-20 dark:bg-[#09090b]">
            <div className="max-w-2xl mx-auto px-4">
                <div className="md:border rounded-xl p-8 space-y-8 md:shadow-sm dark:bg-[#1e1e22]">
                    <h1 className="text-2xl font-bold text-center">
                        Book a Session
                    </h1>

                    <div className="mb-6 text-center space-y-1">
                        <p className="text-sm text-gray-500">
                            Tutor:{" "}
                            <span className="font-semibold text-gray-900">
                                {tutorName}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Subject:{" "}
                            <span className="font-semibold text-gray-900">
                                {subject}
                            </span>
                        </p>
                    </div>

                    <Calendar
                        mode="single"
                        className="rounded-lg border w-full sm:w-2/3 mx-auto"
                        onMonthChange={(date: any) => {
                            setCurrentMonth(date);
                            setSessionDate(""); // ✅ reset date when month changes
                            setFilteredSlots([]);
                        }}
                        // selected={sessionDate}
                        selected={
                            sessionDate ? new Date(sessionDate) : undefined
                        }
                        onSelect={(date: any) => {
                            if (!date || !isDateAvailable(date)) return;
                            const formatted = formatDateLocal(date);
                            console.log("selected date:", formatted); // should be "2026-04-15"
                            setSessionDate(formatted);
                        }}
                        disabled={(date: any) => !isDateAvailable(date)}
                        modifiers={{
                            available: (date: any) => isDateAvailable(date),
                        }}
                        modifiersClassNames={{
                            available: "font-bold text-green-500",
                        }}
                    />

                    {/* SLOTS */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-center">
                            Available Slots
                        </h3>

                        {!sessionDate ? (
                            <p className="text-sm text-gray-500 text-center">
                                Select a date to see slots
                            </p>
                        ) : filteredSlots.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center">
                                No slots available for selected date
                            </p>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-3">
                                {filteredSlots.map((slot) => {
                                    const slotStart = TweleveFormatTime(
                                        slot.startTime,
                                    );
                                    const slotEnd = TweleveFormatTime(
                                        slot.endTime,
                                    );
                                    const isSelected = startTime === slotStart;

                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            onClick={() => {
                                                setStartTime(slotStart);
                                                setEndTime(slotEnd);
                                            }}
                                            className={`border px-4 py-2 rounded-md text-sm transition
                                                ${
                                                    isSelected
                                                        ? "bg-black text-white"
                                                        : "hover:bg-black hover:text-white"
                                                }`}
                                        >
                                            {slot.dayOfWeek} | {slotStart} -{" "}
                                            {slotEnd}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {startTime && (
                        <p className="text-center text-green-600 text-sm">
                            Selected: {startTime} - {endTime}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !startTime}
                        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
                    >
                        {isPending ? "Booking..." : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </section>
    );
}
