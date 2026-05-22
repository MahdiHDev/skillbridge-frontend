import { subjectService } from "@/services/subject.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSubjects = () =>
    useQuery({
        queryKey: ["subjects"],
        queryFn: subjectService.getAll,
    });

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject created successfully!");
        },
        onError: () => {
            toast.error("Failed to create subject.");
        },
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { subject: string } }) =>
            subjectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update subject.");
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => subjectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete subject.");
        },
    });
};
