import { teachingService } from "@/services/teaching.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
