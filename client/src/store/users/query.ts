import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import { UserQueryParams } from "./type";

export const useUsers = (params: UserQueryParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useChangeUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.changeUserPassword,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.resetPassword,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
