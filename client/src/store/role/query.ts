import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "./api";
import { RoleType } from "./type";

// useRoles.ts
export const useRoles = () => {
  const queryClient = useQueryClient();

  // Fetch all roles
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: roleApi.getRoles,
    staleTime: 0,
    retry: 2,
  });

  // Fetch single role
  const useRole = (id: string) =>
    useQuery({
      queryKey: ["role", id],
      queryFn: () => roleApi.getRole(id),
      enabled: !!id,
    });

  // Fetch array of role names
  const rolesArray = useQuery({
    queryKey: ["rolesArray"],
    queryFn: roleApi.getRolesArray,
  });

  // Fetch combined user roles
  const useCombinedRoles = (roles: string[]) =>
    useQuery({
      queryKey: ["combinedRoles", roles],
      queryFn: () => roleApi.getCombinedRole(roles),
      enabled: roles.length > 0,
    });

  // Create role
  const createRoleMutation = useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: (newRole) => {
      // Immediately update the cache with the new role
      queryClient.setQueryData<RoleType[]>(["roles"], (oldRoles) =>
        oldRoles ? [...oldRoles, newRole] : [newRole],
      );

      // Force refetch to ensure data consistency
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["rolesArray"] }),
      ]).then(() => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        queryClient.refetchQueries({ queryKey: ["rolesArray"] });
      });
    },
    onError: (error) => {
      console.error("Failed to create role:", error);
    },
  });

  // Update role
  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Parameters<typeof roleApi.updateRole>[1]) =>
      roleApi.updateRole(id, data),
    onSuccess: () => {
      // Force immediate refetch after invalidation
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["rolesArray"] }),
      ]).then(() => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        queryClient.refetchQueries({ queryKey: ["rolesArray"] });
      });
    },
  });

  // Delete role
  const deleteRoleMutation = useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => {
      // Force immediate refetch after invalidation
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["rolesArray"] }),
      ]).then(() => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        queryClient.refetchQueries({ queryKey: ["rolesArray"] });
      });
    },
  });

  // Update precedences
  const updatePrecedencesMutation = useMutation({
    mutationFn: roleApi.updateRolePrecedences,
    onSuccess: () => {
      // Force immediate refetch after invalidation
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["rolesArray"] }),
      ]).then(() => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        queryClient.refetchQueries({ queryKey: ["rolesArray"] });
      });
    },
  });

  // Reorder precedence
  const reorderPrecedenceMutation = useMutation({
    mutationFn: roleApi.reorderPrecedence,
    onSuccess: () => {
      // Force immediate refetch after invalidation
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["rolesArray"] }),
      ]).then(() => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        queryClient.refetchQueries({ queryKey: ["rolesArray"] });
      });
    },
  });

  return {
    rolesQuery,
    rolesArray,
    useRole,
    useCombinedRoles,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    updatePrecedencesMutation,
    reorderPrecedenceMutation,
  };
};
