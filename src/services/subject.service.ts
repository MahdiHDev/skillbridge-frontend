import { apiClient } from "@/lib/api-client";
import { SubjectResponse } from "@/types/subject.types";

export interface Subject {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export const subjectService = {
    getAll: (): Promise<{ data: Subject[] }> =>
        apiClient.get("/subject/getAllSubjects").then((r) => r.data),

    create: async (payload: { subject: string }): Promise<SubjectResponse> => {
        // ✅ add payload param
        const { data } = await apiClient.post<SubjectResponse>(
            "/subject/create",
            payload,
        );
        return data;
    },

    update: async (
        id: string,
        payload: { subject: string },
    ): Promise<SubjectResponse> => {
        const { data } = await apiClient.patch<SubjectResponse>(
            `/subject/update/${id}`,
            payload,
        );
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/subject/delete/${id}`);
    },
};
