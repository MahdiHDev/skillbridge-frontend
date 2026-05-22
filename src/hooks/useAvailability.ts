import {
    availabilityService,
    CreateAvailabilityPayload,
    EditAvailabilityPayload,
} from "@/services/availability.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const availabilityKeys = {
    all: ["availability"] as const,
};

export const useGetAvailability = () =>
    useQuery({
        queryKey: availabilityKeys.all,
        queryFn: availabilityService.getAll,
    });

// hooks/useAvailability.ts
export const useGetAvailabilityById = (tutorProfileId: string) =>
    useQuery({
        queryKey: ["availability", tutorProfileId],
        queryFn: () => availabilityService.getByTutorId(tutorProfileId),
        enabled: !!tutorProfileId,
    });

export const useCreateAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAvailabilityPayload) => {
            console.log("creating availability with data", data);
            return availabilityService.create(data);
        },
        onSuccess: () => {
            toast.success("Availability saved");
            queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useEditAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EditAvailabilityPayload;
        }) => availabilityService.update(id, data),
        onSuccess: () => {
            toast.success("Availability updated");
            queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useDeleteAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => availabilityService.delete(id),
        onSuccess: () => {
            toast.success("Availability slot removed");
            queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useGetAvailableDates = (
    tutorProfileId: string,
    year: number,
    month: number,
) => {
    return useQuery({
        queryKey: ["available-dates", tutorProfileId, year, month],
        queryFn: () =>
            availabilityService.availableDates(tutorProfileId, year, month),
        enabled: !!tutorProfileId && !!year && !!month,
    });
};
