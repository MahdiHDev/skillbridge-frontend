import { apiClient } from "@/lib/api-client";
import {
    GetUsersParams,
    GetUsersResponse,
    UpdateUserStatusResponse,
    User,
} from "@/types/admin.types";

export const adminUserService = {
    getAllUsers: async (
        params: GetUsersParams = {},
    ): Promise<GetUsersResponse> => {
        const { data } = await apiClient.get<GetUsersResponse>("/admin/users", {
            params,
        });
        return data;
    },

    updateUserStatus: async (
        userId: string,
        status: User["status"],
    ): Promise<UpdateUserStatusResponse> => {
        const { data } = await apiClient.patch<UpdateUserStatusResponse>(
            `/admin/users/${userId}/status`,
            {
                status,
            },
        );
        return data;
    },
};
