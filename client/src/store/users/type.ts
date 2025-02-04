export interface userType {
  _id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
  settings?: {
    isRegistered?: boolean;
    isPassChange: boolean;
  };
}

export interface ChangeUserPassword {
  currentPassword: string;
  newPassword: string;
  isPassChange: boolean;
}

// Types for pagination and response
export interface PaginatedResponse {
  users: userType[];
  currentPage: number;
  limitNumber: number;
  totalPages: number;
  totalUsers: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export interface ResetPasswordParams {
  userId: string;
  resetBy: string;
}
