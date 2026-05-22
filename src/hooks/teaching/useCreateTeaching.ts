import {
    CreateTeachingPayload,
    teachingService,
} from "@/services/teaching.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
