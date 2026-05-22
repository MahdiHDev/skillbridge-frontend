import { apiClient } from "@/lib/api-client";
import {
    BookingStatus,
    createBookingPayload,
    GetTeachingSessionsParams,
    TeachingSessionsResponse,
} from "@/types/booking.types";
import { GetBookingsParams, GetBookingsResponse } from "@/types/subject.types";

export const bookingService = {
    createBooking: async (data: createBookingPayload) => {
        const res = await apiClient.post("booking/create", data);
        return res.data;
    },
    mysessions: async () => {
        const res = await apiClient.get("booking/my-sessions");
        return res.data;
    },
    getTutorSessions: async function (
        params?: GetTeachingSessionsParams,
    ): Promise<TeachingSessionsResponse> {
        const { data } = await apiClient.get<TeachingSessionsResponse>(
            "booking/teaching",
            {
                params,
            },
        );
        return data;
    },
    getAll: async (
        params: GetBookingsParams = {},
    ): Promise<GetBookingsResponse> => {
        const { data } = await apiClient.get<GetBookingsResponse>(
            "/booking/getAllBooking",
            { params },
        );
        return data;
    },
    getUpcoming: async () => {
        const { data } = await apiClient.get("/booking/upcoming");
        return data;
    },

    updateBookingStatus: async (
        id: string,
        data: { status: BookingStatus; meetingLink?: string },
    ) => {
        const res = await apiClient.patch(`booking/${id}/status`, data);
        return res.data;
    },
};
