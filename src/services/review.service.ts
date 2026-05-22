import { apiClient } from "@/lib/api-client";
import { createReviewPayload, GetReviewsResponse } from "@/types/review.types";

export const reviewService = {
    createReview: async (data: createReviewPayload) => {
        const res = await apiClient.post("review/create", data);
        return res.data;
    },
    getMyReviews: async () => {
        const res = await apiClient.get("/review/my");
        return res.data;
    },

    getByTutorProfileId: async (
        tutorProfileId: string,
    ): Promise<GetReviewsResponse> => {
        const { data } = await apiClient.get<GetReviewsResponse>(
            `/review/${tutorProfileId}`,
        );
        return data;
    },
    deleteReview: async (reviewId: string) => {
        const res = await apiClient.delete(`/review/${reviewId}`);
        return res.data;
    },

    // mysessions: async () => {
    //     const res = await apiClient.get("booking/my-sessions");
    //     return res.data;
    // },
    // getTutorSessions: async function (
    //     params?: GetTeachingSessionsParams,
    // ): Promise<TeachingSessionsResponse> {
    //     const { data } = await apiClient.get<TeachingSessionsResponse>(
    //         "booking/teaching",
    //         {
    //             params,
    //         },
    //     );
    //     return data;
    // },
    // updateBookingStatus: async (
    //     id: string,
    //     data: { status: BookingStatus; meetingLink?: string },
    // ) => {
    //     const res = await apiClient.patch(`booking/${id}/status`, data);
    //     return res.data;
    // },
};
