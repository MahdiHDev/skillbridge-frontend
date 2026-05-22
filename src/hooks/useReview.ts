import { reviewService } from "@/services/review.service";
import { createReviewPayload } from "@/types/review.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateReview = () => {
    // const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createReviewPayload) =>
            reviewService.createReview(data),
        onSuccess: () => {
            toast.success("Review Created");
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
            // router.push("/my-sessions");
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Something went wrong",
            );
        },
    });
};

export const useGetReviews = (tutorProfileId: string) =>
    useQuery({
        queryKey: ["reviews", tutorProfileId],
        queryFn: () => reviewService.getByTutorProfileId(tutorProfileId),
        enabled: !!tutorProfileId,
    });

export const useMyReviews = () => {
    return useQuery({
        queryKey: ["my-reviews"],
        queryFn: reviewService.getMyReviews,
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reviewService.deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-reviews"],
            });
            queryClient.invalidateQueries({
                queryKey: ["reviews"],
            });
        },
    });
};
