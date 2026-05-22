"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDeleteAvailability,
    useGetAvailability,
} from "@/hooks/useAvailability";
import { formatDate } from "@/lib/dateFormat";
import { TweleveFormatTime } from "@/lib/formatTime";
import {
    AvailabilitySlot,
    DayOfWeek,
    SlotInput,
} from "@/services/availability.service";
import { CalendarDays, Clock, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DAYS: { value: DayOfWeek; label: string }[] = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
];

function SlotCard({
    slot,
    onDelete,
    isDeleting,
}: {
    slot: AvailabilitySlot;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}) {
    const dayLabel =
        DAYS.find((d) => d.value === slot.dayOfWeek)?.label ?? slot.dayOfWeek;

    return (
        <Card className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100`}
                >
                    {dayLabel}
                </span>
                <Badge variant={slot.isActive ? "default" : "secondary"}>
                    {slot.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>
                    {TweleveFormatTime(slot.startTime)} —{" "}
                    {TweleveFormatTime(slot.endTime)}
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                    {formatDate(slot.startDate)} → {formatDate(slot.endDate)}
                </span>
            </div>

            <AlertDialog>
                <div className="flex gap-2 items-center mt-2">
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-1/2 cursor-pointer"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <span className="animate-spin mr-2">⏳</span>
                            ) : (
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                            )}
                            {isDeleting ? "Removing..." : "Remove"}
                        </Button>
                    </AlertDialogTrigger>
                    <Link
                        href={`availability/${slot.id}/edit`}
                        className="w-1/2"
                    >
                        <Button
                            variant={"secondary"}
                            size="sm"
                            className="cursor-pointer text-blue-600 w-full"
                        >
                            <Edit />
                            Edit
                        </Button>
                    </Link>
                </div>
                <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove slot?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove {dayLabel}{" "}
                            {TweleveFormatTime(slot.startTime)} —{" "}
                            {TweleveFormatTime(slot.endTime)} availability slot?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(slot.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

function SlotCardSkeleton() {
    return (
        <Card className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full" />
        </Card>
    );
}

export default function AvailabilityPage() {
    const { data, isLoading, isError } = useGetAvailability();
    const { mutateAsync: deleteSlot } = useDeleteAvailability();

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [slots, setSlots] = useState<SlotInput[]>([
        { dayOfWeek: "MON", startTime: "", endTime: "" },
    ]);

    const apiSlots = data?.data ?? [];

    const handleDelete = (id: string) => {
        setDeletingId(id);
        deleteSlot(id, {
            onSettled: () => setDeletingId(null),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Availability</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Set the days and times you are available to teach
                    </p>
                </div>
                <Link href={"availability/create"} className="">
                    <Button className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                    </Button>
                </Link>
            </div>

            {/* Error */}
            {isError && (
                <Card className="p-6 text-center text-muted-foreground">
                    Failed to load availability. Please try again.
                </Card>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <SlotCardSkeleton key={i} />
                      ))
                    : apiSlots.map((slot) => (
                          <SlotCard
                              key={slot.id} // solve this error
                              slot={slot} // solve this error
                              onDelete={handleDelete}
                              isDeleting={deletingId === slot.id} // solve this error
                          />
                      ))}
            </div>

            {/* Empty */}
            {!isLoading && !isError && slots.length === 0 && (
                <Card className="p-10 text-center space-y-3">
                    <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                        No availability slots yet.
                    </p>
                    <Link href={"create"}>
                        <Button variant="outline">Add your first slot</Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}
