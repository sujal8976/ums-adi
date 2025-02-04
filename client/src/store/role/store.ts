import { create } from "zustand";
import { RoleType } from "./type";

interface RoleStore {
  selectedRole: RoleType | null;
  setSelectedRole: (role: RoleType | null) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));
