export interface createReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
}

export interface Review {
    id: string;
    bookingId: string;
    studentId: string;
    tutorProfileId: string;
    rating: number;
    comment: string;
    createdAt: string;
    student: {
        id: string;
        name: string;
    };
}

export interface GetReviewsResponse {
    success: boolean;
    message: string;
    data: Review[];
}
