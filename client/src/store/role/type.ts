export interface Permission {
  page: string;
  actions: string[];
}

export interface RoleType {
  _id: string;
  name: string;
  precedence: number;
  permissions: Permission[];
  createdBy: string;
  updatedBy: string;
}

export interface RoleArrayType {
  _id: string;
  name: string;
  precedence: number;
}

export interface CombinedRoleType {
  highestRole: string;
  roles: string[];
  highestPrecedence: number;
  permissions: Permission[];
}

export interface PrecedenceUpdate {
  _id: string;
  precedence: number;
}
