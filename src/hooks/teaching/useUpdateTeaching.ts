import {
    teachingService,
    UpdateTeachingPayload,
} from "@/services/teaching.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateTeaching = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeachingPayload) =>
            teachingService.update(id, data),
        onSuccess: () => {
            toast.success("Teaching Session Updated Successfully");
            queryClient.invalidateQueries({ queryKey: ["teachings"] });
        },
    });
};
