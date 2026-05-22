// types/subject.types.ts
export interface Subject {
    id: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SubjectResponse {
    success: boolean;
    message: string;
    data: Subject[];
}

// types/booking.types.ts
import { User } from "./admin.types";

export interface Subject {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export interface TutorProfile {
    id: string;
    userId: string;
    bio: string;
    totalReviews: number;
    averageRating: number;
    status: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    user: User;
}

export interface TutorCategory {
    id: string;
    tutorProfileId: string;
    subjectId: string;
    hourlyRate: number;
    experienceYears: number;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    description: string;
    isPrimary: boolean;
    createdAt: string;
    subject: Subject;
    tutorProfile: TutorProfile;
}

export interface Booking {
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
    student: User;
    tutorCategory: TutorCategory;
}

export interface GetBookingsParams {
    page?: number;
    limit?: number;
    status?: string;
    studentId?: string;
    tutorId?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface GetBookingsResponse {
    success: boolean;
    message: string;
    data: {
        data: Booking[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}
