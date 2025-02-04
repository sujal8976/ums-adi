import { userType } from "@/store/users";
import newRequest from "@/utils/func/request";
import { CustomAxiosError } from "@/utils/types/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { roleApi } from "@/store/role";
import { LoginData } from "./type";
import { useAuthStore } from "./store";

export const useAuth = (enabled = false) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setCombinedRole } = useAuthStore();

  const login = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await newRequest.post("/auth/login", credentials);
      return response.data.data as userType;
    },
    onSuccess: async (userData) => {
      // Fetch combined role after user data
      const combinedRole = await roleApi.getCombinedRole(userData.roles);

      // Setting current user and combined role
      setUser(userData);
      setCombinedRole(combinedRole);

      if (userData.settings?.isPassChange) {
        navigate(`/auth/change-password/${userData._id}`);
      } else if (!userData.settings?.isRegistered) {
        navigate(`/auth/register-user/${userData._id}`);
      } else {
        navigate("/panel/");
        setUser(userData);
      }
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      setUser(null);
      await newRequest.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
      navigate("/auth/login");
    },
    onError: () => {
      navigate("/auth/login");
    },
  });

  const {
    data: currentUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await newRequest.post("/auth/current-user");
      const userData = response.data.data;

      // Fetch combined role after user data
      const combinedRole = await roleApi.getCombinedRole(userData.roles);

      // Setting current user and combined role
      setUser(userData);
      setCombinedRole(combinedRole);

      return userData;
    },
    enabled,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    user: currentUser,
    isLoading,
    login: login.mutate,
    logout: logout.mutate,
    checkUser: refetch,
    isLoggingIn: login.isPending,
    loginError: login.error as CustomAxiosError | null,
    combinedRole: useAuthStore((state) => state.combinedRole), // Expose combinedRole
  };
};
