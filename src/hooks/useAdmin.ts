import { adminUserService } from "@/services/admin.service";
import { GetUsersParams, User } from "@/types/admin.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAdminUsers = (params: GetUsersParams = {}) => {
    return useQuery({
        queryKey: ["admin-users", params],
        queryFn: () => adminUserService.getAllUsers(params), // ✅ was: getUsers
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            { userId, status }: { userId: string; status: User["status"] }, // ✅ was: status: string
        ) => adminUserService.updateUserStatus(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User status updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update user status.");
        },
    });
};
