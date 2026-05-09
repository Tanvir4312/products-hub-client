export interface IModeratorData {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: any;
}

export interface IUpdateModeratorPayload {
  name?: string;
  email?: string;
  contactNumber?: string;
  profilePhoto?: string | File | null;
  gender?: "MALE" | "FEMALE" | "OTHER";
}
