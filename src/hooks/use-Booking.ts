import { bookingService } from "@/services/booking.service";
import {
    BookingStatus,
    createBookingPayload,
    GetTeachingSessionsParams,
} from "@/types/booking.types";
import { GetBookingsParams } from "@/types/subject.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const sessionKeys = {
    all: () => ["sessions"] as const,
    list: (params: GetTeachingSessionsParams) =>
        ["sessions", "list", params] as const,
    detail: (id: string) => ["sessions", "detail", id] as const,
};

export const useCreateBooking = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createBookingPayload) =>
            bookingService.createBooking(data),
        onSuccess: () => {
            toast.success("Booking Created");
            queryClient.invalidateQueries({ queryKey: ["my-sessions"] });

            queryClient.invalidateQueries({
                queryKey: ["available-dates"],
            });
            router.push("/my-sessions");
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useMySessions = () => {
    return useQuery({
        queryKey: ["my-sessions"],
        queryFn: () => bookingService.mysessions(),
    });
};

export const useTeachingSessions = (params: GetTeachingSessionsParams) => {
    return useQuery({
        queryKey: sessionKeys.list(params),
        queryFn: () => bookingService.getTutorSessions(params),
    });
};

export const useUpcomingSessions = () =>
    useQuery({
        queryKey: ["upcoming-sessions"],
        queryFn: bookingService.getUpcoming,
    });

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            status,
            meetingLink,
        }: {
            id: string;
            status: BookingStatus;
            meetingLink?: string;
        }) => bookingService.updateBookingStatus(id, { status, meetingLink }),
        onSuccess: () => {
            toast.success("Booking status updated");
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
            queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
            queryClient.invalidateQueries({ queryKey: ["teaching-sessions"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useBookings = (params: GetBookingsParams = {}) =>
    useQuery({
        queryKey: ["bookings", params],
        queryFn: () => bookingService.getAll(params),
    });
