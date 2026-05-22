import { apiClient } from "@/lib/api-client";
import {
    GetTutorParams,
    SubjectsResponse,
    TutorsResponse,
} from "@/types/tutor.types";

export enum ApproveStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export const tutorService = {
    getAllTutors: async function (
        params?: GetTutorParams,
    ): Promise<TutorsResponse> {
        const { data } = await apiClient.get<TutorsResponse>(
            "/tutor/getAllTutors",
            {
                params,
            },
        );
        return data;
    },

    getAllSubjects: async function (): Promise<SubjectsResponse> {
        const { data } = await apiClient.get<SubjectsResponse>(
            "/subject/getAllSubjects",
        );
        return data;
    },

    getAdminTutors: async (params: any) => {
        const { data } = await apiClient.get("/tutor/getAllTutors/admin", {
            params,
        });
        return data;
    },
    approveTutor: async (data: { tutorProfileId: string; status: string }) => {
        const { data: res } = await apiClient.patch("/tutor/approve", data);
        return res;
    },

    createTutorProfile: async function (bio: string): Promise<void> {
        await apiClient.post("/tutor/create", { bio });
    },

    getTutorProfile: async () => {
        const { data } = await apiClient.get("/tutor/getMyProfile"); // adjust endpoint
        return data;
    },
    updateTutorProfile: async (payload: {
        tutorProfileId: string;
        bio: string;
    }) => {
        const { data } = await apiClient.put(
            "/tutor/updateTutorProfile",
            payload,
        );
        return data;
    },
};
