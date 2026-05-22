import { apiClient } from "@/lib/api-client";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface AvailabilitySlot {
    id: string;
    tutorProfileId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}

export interface EditAvailabilityPayload {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
}

export interface SlotInput {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
}

export interface CreateAvailabilityPayload {
    startDate: string;
    endDate: string;
    slots: SlotInput[];
}

export const availabilityService = {
    getAll: async (): Promise<{ data: AvailabilitySlot[] }> => {
        const res = await apiClient.get("/availability/me");
        return res.data;
    },
    getByTutorId: async (
        tutorProfileId: string,
    ): Promise<{ data: AvailabilitySlot[] }> => {
        const res = await apiClient.get(`/availability/${tutorProfileId}`);
        return res.data;
    },

    create: async (data: CreateAvailabilityPayload) => {
        const res = await apiClient.post("/availability/create", data);
        return res.data;
    },

    update: async (id: string, data: EditAvailabilityPayload) => {
        const res = await apiClient.patch(`/availability/update/${id}`, data);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await apiClient.delete(`/availability/delete/${id}`);
        return res.data;
    },
    availableDates: async (
        tutorProfileId: string,
        year: number,
        month: number, // 1-indexed
    ) => {
        const res = await apiClient.get(
            `/availability/${tutorProfileId}/available-dates?year=${year}&month=${month}`,
        );
        return res.data;
    },
};
