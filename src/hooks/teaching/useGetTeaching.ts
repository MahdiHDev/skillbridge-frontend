import { teachingService } from "@/services/teaching.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTeachings = () =>
    useQuery({
        queryKey: ["teachings"],
        queryFn: teachingService.getAll,
    });
