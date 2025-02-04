import newRequest from "@/utils/func/request";
import {
  ChangeUserPassword,
  PaginatedResponse,
  ResetPasswordParams,
  UserQueryParams,
  userType,
} from "./type";

export const userApi = {
  getUsers: async ({
    page = 1,
    limit = 5,
    role,
    search,
  }: UserQueryParams = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role }),
      ...(search && { search }),
    });
    const response = await newRequest.get(`/user?${queryParams}`);
    return response.data as PaginatedResponse;
  },
  getUserById: async (userId: string) => {
    const response = await newRequest.get(`/user/${userId}`);
    return response.data;
  },
  createUser: async (userData: Omit<userType, "_id">) => {
    const response = await newRequest.post("/user", userData);
    return response.data;
  },
  updateUser: async ({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<userType>;
  }) => {
    const response = await newRequest.patch(`/user/${userId}`, updates);
    return response.data;
  },
  changeUserPassword: async ({
    userId,
    passwords,
  }: {
    userId: string;
    passwords: ChangeUserPassword;
  }) => {
    const response = await newRequest.patch(
      `/user/${userId}/password`,
      passwords,
    );
    return response.data;
  },
  resetPassword: async ({ userId, resetBy }: ResetPasswordParams) => {
    const response = await newRequest.post("/user/reset-password", {
      userId,
      resetBy,
    });
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await newRequest.delete(`/user/${userId}`);
    return response.data;
  },
};
