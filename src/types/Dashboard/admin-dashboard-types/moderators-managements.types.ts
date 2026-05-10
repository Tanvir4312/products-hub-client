import { IUser } from "./users-managements.types";

export interface IModerator {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  user: IUser;
}

export interface IModeratorResponse {
  success: boolean;
  message: string;
  data: {
    data: IModerator[];
    meta: {
      limit: number;
      current_Page: number;
      total_page: number;
      total: number;
    };
  };
}
