import { CombinedRoleType } from "@/store/role";
import { userType } from "@/store/users";

export interface LoginData {
  loginId: string;
  password: string;
}

export interface AuthStore {
  user: userType | null;
  combinedRole: CombinedRoleType | null;
  setUser: (user: userType | null) => void;
  setCombinedRole: (combinedRole: CombinedRoleType | null) => void;
}
