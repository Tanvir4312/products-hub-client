import { IUser } from "./users-managements.types";

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  user: IUser;
}

export interface IAdminResponse {
  success: boolean;
  message: string;
  data: {
    data: IAdmin[];
    meta: {
      limit: number;
      current_Page: number;
      total_page: number;
      total: number;
    };
  };
}
