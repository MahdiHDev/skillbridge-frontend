import { tutorService } from "@/services/tutor.service";
import { GetTutorParams } from "@/types/tutor.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const tutorKeys = {
    all: () => ["tutors"] as const,
    list: (params: GetTutorParams) => ["tutors", "list", params] as const,
    detail: (id: string) => ["tutors", "detail", id] as const,
};

export function useTutors(params: GetTutorParams) {
    return useQuery({
        queryKey: tutorKeys.list(params),
        queryFn: () => tutorService.getAllTutors(params),
    });
}

export function useSubjects() {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: () => tutorService.getAllSubjects(),
        staleTime: Infinity, // subjects rarely change
    });
}

export const useAdminTutors = (params: any) => {
    return useQuery({
        queryKey: ["admin-tutors", params],
        queryFn: () => tutorService.getAdminTutors(params),
    });
};

export const useCreateTutorProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { bio: string }) =>
            tutorService.createTutorProfile(data.bio),
        onSuccess: () => {
            toast.success(
                "Application submitted! You'll receive an email once approved.",
            );
            queryClient.invalidateQueries({ queryKey: ["tutors"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useApproveTutor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            tutorProfileId: string;
            status: "APPROVED" | "REJECTED";
        }) => tutorService.approveTutor(data),
        onSuccess: () => {
            toast.success("Tutor status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-tutors"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useTutorProfile = () => {
    return useQuery({
        queryKey: ["tutor-profile"],
        queryFn: () => tutorService.getTutorProfile(),
    });
};

export const useUpdateTutorProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { tutorProfileId: string; bio: string }) =>
            tutorService.updateTutorProfile(data),
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};
