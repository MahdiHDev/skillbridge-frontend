import {
    CreateTeachingPayload,
    teachingService,
    UpdateTeachingPayload,
} from "@/services/teaching.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTeaching = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTeachingPayload) =>
            teachingService.createTeaching(data),
        onSuccess: () => {
            toast.success("Teaching subject created successfully");
            queryClient.invalidateQueries({ queryKey: ["teachings"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useGetTeachings = () =>
    useQuery({
        queryKey: ["teachings"],
        queryFn: teachingService.getAll,
    });

export const useUpdateTeaching = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeachingPayload) =>
            teachingService.update(id, data),
        onSuccess: () => {
            toast.success("Teaching Session Updated Successfully");
            queryClient.invalidateQueries({
                queryKey: ["teachings"],
            });
            queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
        },
    });
};

export const useDeleteTeaching = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => teachingService.delete(id),
        onSuccess: () => {
            toast.success("Teaching session deleted");
            queryClient.invalidateQueries({ queryKey: ["teachings"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};
