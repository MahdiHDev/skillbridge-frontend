"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useTeachingSessions,
    useUpdateBookingStatus,
} from "@/hooks/use-Booking";
import { formatDate } from "@/lib/dateFormat";
import { TweleveFormatTime } from "@/lib/formatTime";
import { Edit, Loader2Icon } from "lucide-react";
import { useState } from "react";

// 👉 dummy data
const data = [
    {
        id: "da35ffa7-ab8f-405e-bbc1-cc7960ac7a16",
        sessionDate: "2026-03-18T00:00:00.000Z",
        startTime: "1970-01-01T16:00:00.000Z",
        endTime: "1970-01-01T18:00:00.000Z",
        price: 91,
        status: "COMPLETED",
        meetingLink: "https://meet.google.com/kth-mvav-pgw",
        tutorCategory: {
            subject: { name: "docker containerization" },
            tutorProfile: { user: { name: "Mahdi Hussain" } },
        },
    },
];

export default function GetTutorSession() {
    // const [sessions, setSessions] = useState<any[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);

    // Query params for filtering
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [editSessionId, setEditSessionId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState("");
    const [editMeetingLink, setEditMeetingLink] = useState("");

    // pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);

    const { data: mySessionsData, isLoading } = useTeachingSessions({
        page: String(page),
        limit: String(limit),
        status,
        startDate: from,
        endDate: to,
    });

    const { mutateAsync, isPending: isUpdating } = useUpdateBookingStatus();

    const totalPages = mySessionsData?.data.pagination.totalPages ?? 1;

    const sessions = mySessionsData?.data.data ?? [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    function handleFilterChange(setter: (v: string | undefined) => void) {
        return (value: string | undefined) => {
            setter(value);
            setPage(1);
        };
    }

    const handleEditOpen = (session: any) => {
        setEditSessionId(session.id);
        setEditStatus(session.status);
        setEditMeetingLink(session.meetingLink ?? "");
    };

    const handleEditSubmit = async () => {
        await mutateAsync({
            id: editSessionId!,
            status: editStatus as any,
            meetingLink: editMeetingLink,
        });
        setDialogOpen(false);
    };

    return (
        <section className="py-10">
            <div className="w-full mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-10">My Sessions</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field>
                            <FieldContent>
                                <FieldLabel htmlFor="first-name">
                                    Status
                                </FieldLabel>
                            </FieldContent>
                            <Select
                                value={status ?? "ALL"}
                                onValueChange={(val) =>
                                    handleFilterChange(setStatus)(
                                        val === "ALL" ? undefined : val,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Filter by Status
                                        </SelectLabel>
                                        <SelectItem value="ALL">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Confirmed
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Cancelled
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="first-name">From</FieldLabel>
                            <Input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="last-name">To </FieldLabel>
                            <Input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                    {/* <Input
                        type="date"

                        // value={maxPrice}
                        // onChange={(e) =>
                        //     handleFilterChange(setMaxPrice)(e.target.value)
                        // }
                    /> */}

                    {/* <select
                        className="border rounded-md px-3"
                        value={status}
                        // onChange={(e) =>
                        //     handleFilterChange(setStatus)(e.target.value)
                        // }
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select> */}
                </div>
                {isLoading ? (
                    <div className="py-20">
                        <p className="text-center text-gray-500">Loading...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No bookings yet
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="border rounded-xl p-6 space-y-4 shadow-sm bg-white dark:bg-[#141414] relative"
                            >
                                <div className="absolute top-4 right-4 flex gap-2 items-center">
                                    <Dialog
                                        open={dialogOpen}
                                        onOpenChange={setDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Edit
                                                onClick={() =>
                                                    handleEditOpen(session)
                                                }
                                                size={20}
                                                className="cursor-pointer hover:text-blue-500 duration-300"
                                            />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-sm">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Edit Booking
                                                </DialogTitle>
                                            </DialogHeader>
                                            <FieldGroup>
                                                <Field>
                                                    <Label htmlFor="name-1">
                                                        Meeting Link
                                                    </Label>
                                                    <Input
                                                        id="name-1"
                                                        value={editMeetingLink}
                                                        name="name"
                                                        onChange={(e) =>
                                                            setEditMeetingLink(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="https://meet.google.com/..."
                                                    />
                                                </Field>
                                                <Field>
                                                    <Label htmlFor="username-1">
                                                        Status
                                                    </Label>
                                                    <Select
                                                        value={editStatus}
                                                        onValueChange={
                                                            setEditStatus
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="PENDING">
                                                                    Pending
                                                                </SelectItem>
                                                                <SelectItem value="CONFIRMED">
                                                                    Confirmed
                                                                </SelectItem>
                                                                <SelectItem value="COMPLETED">
                                                                    Completed
                                                                </SelectItem>
                                                                <SelectItem value="CANCELLED">
                                                                    Cancelled
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            </FieldGroup>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    onClick={handleEditSubmit}
                                                    type="submit"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <Loader2Icon className="animate-spin duration-300" />
                                                    ) : (
                                                        "Save changes"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* SUBJECT */}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Subject
                                    </p>
                                    <p className="font-semibold">
                                        {session.tutorCategory.subject.name}
                                    </p>
                                </div>

                                {/* TUTOR */}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tutor
                                    </p>
                                    <p className="font-semibold">
                                        {
                                            session.tutorCategory.tutorProfile
                                                .user.name
                                        }
                                    </p>
                                </div>

                                {/* DATE + TIME */}
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

                                {/* PRICE + STATUS */}
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">
                                        ${session.price}
                                    </p>
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full ${getStatusColor(session.status)}`}
                                    >
                                        {session.status}
                                    </span>
                                </div>

                                {/* MEETING LINK */}
                                {session.meetingLink ? (
                                    <p className="block text-center border p-1 rounded-md text-sm truncate dark:text-white">
                                        {session.meetingLink}
                                    </p>
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No meeting link provided
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-6">
                    {/* LIMIT CONTROL */}
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
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {[1, 3, 6, 9, 12, 20].map((opt) => (
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
