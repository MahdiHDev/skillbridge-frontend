export interface GetTutorParams {
    page?: string;
    limit?: string;
    skip?: string;
    search?: string;
    subject?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string;
    sortBy?: string;
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
    subject: Subject;
    hourlyRate: number;
    experienceYears: number;
    level: string;
    description: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: string;
    status: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Tutor {
    id: string;
    userId: string;
    user: User;
    bio: string;
    status: string;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    tutorCategories: TutorCategory[];
    createdAt: string;
    updatedAt: string;
}

export interface TutorPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TutorsResponse {
    success: boolean;
    message: string;
    data: {
        data: Tutor[];
        pagination: TutorPagination;
    };
}

// export interface TutorResponse {
//     success: boolean;
//     message: string;
//     data: Tutor;
// }

export interface CreateTutorData {
    bio: string;
    hourlyRate: number;
    subjectId: string;
}
export interface UpdateTutorData {
    bio?: string;
    hourlyRate?: number;
    subjectId?: string;
    status?: string;
}

export interface SubjectsResponse {
    success: boolean;
    message: string;
    data: Subject[];
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
    booking?: {
        tutorCategory: {
            subject: Subject;
        };
    };
}

export interface TutorResponse {
    success: boolean;
    message: string;
    data: Tutor & {
        reviews: Review[];
    };
}

export interface TutorProfileData {
    id: string;
    userId: string;
    bio: string;
    totalReviews: number;
    averageRating: number;
    status: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    tutorCategories: TutorCategory[];
    reviews: Review[];
    user?: User; // optional — not always returned
}

export interface TutorProfileResponse {
    success: boolean;
    message: string;
    data: TutorProfileData;
}
