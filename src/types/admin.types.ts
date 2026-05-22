export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
    sortOrder?: "asc" | "desc";
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: "TUTOR" | "ADMIN" | "STUDENT";
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetUsersResponse {
    success: boolean;
    message: string;
    data: {
        data: User[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    data: User;
}
