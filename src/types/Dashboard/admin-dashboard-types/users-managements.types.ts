export interface IUsersData {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  contactNumber?: string;
  profilePhoto?: string | File | null;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN" | "MODERATOR" | "USER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: boolean;
  needPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface IUserResponse {
  success: boolean;
  message: string;
  data: {
    data: IUser[];
    meta: {
      limit: number;
      current_Page: number;
      total_page: number;
      total: number;
    };
  };
}

export interface IUpdateUserStatusPayload {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface IUpdateUserRolePayload {
  role: "ADMIN" | "MODERATOR" | "USER";
}