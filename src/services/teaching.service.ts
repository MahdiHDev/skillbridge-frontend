import { apiClient } from "@/lib/api-client"; // your axios/fetch instance

export const teachingService = {
    createTeaching: async (data: CreateTeachingPayload) => {
        const res = await apiClient.post("/tutor/createTeachingSession", data);
        return res.data;
    },
    getAll: async (): Promise<{ data: TeachingSession[] }> => {
        const res = await apiClient.get("/tutor/getTeachingSession");
        return res.data;
    },
    update: async (id: string, data: UpdateTeachingPayload) => {
        const res = await apiClient.put(
            `/tutor/updateTeachingSession/${id}`,
            data,
        );
        return res.data;
    },
    delete: async (id: string) => {
        const res = await apiClient.delete(
            `/tutor/deleteTeachingSession/${id}`,
        );
        return res.data;
    },
};

export interface TeachingSession {
    id: string;
    tutorProfileId: string;
    subjectId: string;
    hourlyRate: number;
    experienceYears: number;
    level: TeachingLevel;
    description: string;
    isPrimary: boolean;
    createdAt: string;
    subject: {
        id: string;
        name: string;
        slug: string;
        createdAt: string;
    };
}

export interface UpdateTeachingPayload {
    hourlyRate?: number;
    experienceYears?: number;
    level?: TeachingLevel;
    description?: string;
    isPrimary?: boolean;
}

export type TeachingLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface CreateTeachingPayload {
    subjectName: string;
    hourlyRate: number;
    experienceYears: number;
    level: TeachingLevel;
    bio?: string;
}
