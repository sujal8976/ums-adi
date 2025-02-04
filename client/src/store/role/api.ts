import newRequest from "@/utils/func/request";
import {
  CombinedRoleType,
  Permission,
  PrecedenceUpdate,
  RoleArrayType,
  RoleType,
} from "./type";

//Role Api
export const roleApi = {
  getRoles: async () => {
    const response = await newRequest.get<{ roles: RoleType[] }>("/role");
    return response.data.roles;
  },

  getRole: async (id: string) => {
    const response = await newRequest.get<{ role: RoleType }>(`/role/${id}`);
    return response.data.role;
  },

  getRolesArray: async () => {
    const response = await newRequest.get<{ roles: RoleArrayType[] }>(
      "/role/rolesArray",
    );
    return response.data.roles;
  },

  getCombinedRole: async (roles: string[]) => {
    const response = await newRequest.post<CombinedRoleType>(
      "/role/combinedRole",
      { roles },
    );
    return response.data;
  },

  createRole: async (roleData: {
    name: string;
    permissions: Permission[];
    createdBy: string;
  }) => {
    const response = await newRequest.post<{ role: RoleType }>(
      "/role",
      roleData,
    );
    return response.data.role;
  },

  updateRole: async (
    id: string,
    roleData: {
      name?: string;
      permissions?: Permission[];
      updatedBy: string;
    },
  ) => {
    const response = await newRequest.patch<{ role: RoleType }>(
      `/role/${id}`,
      roleData,
    );
    return response.data.role;
  },

  deleteRole: async (id: string) => {
    const response = await newRequest.delete(`/role/${id}`);
    return response.data;
  },

  updateRolePrecedences: async (updates: PrecedenceUpdate[]) => {
    const response = await newRequest.patch<{ roles: RoleType[] }>(
      "/role/precedence",
      { updates },
    );
    return response.data.roles;
  },

  reorderPrecedence: async () => {
    const response = await newRequest.post("/role/reorder");
    return response.data;
  },
};
