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