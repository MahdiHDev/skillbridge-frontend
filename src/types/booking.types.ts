export interface createBookingPayload {
    tutorCategoryId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
}

export interface Subject {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export interface TutorCategory {
    id: string;
    tutorProfileId: string;
    subjectId: string;
    hourlyRate: number;
    experienceYears: number;
    level: string;
    description: string;
    isPrimary: boolean;
    createdAt: string;
    subject: Subject;
    tutorProfile: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
}

export interface TeachingSession {
    id: string;
    studentId: string;
    tutorCategoryId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    price: number;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    meetingLink: string | null;
    createdAt: string;
    updatedAt: string;
    student: Student;
    tutorCategory: TutorCategory;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TeachingSessionsData {
    data: TeachingSession[];
    pagination: Pagination;
}

export interface TeachingSessionsResponse {
    success: boolean;
    message: string;
    data: TeachingSessionsData;
}

export interface GetTeachingSessionsParams {
    page?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}
