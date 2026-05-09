import { UserStatus } from "../enums";




export interface IAdminsData {
 id: string;
 name: string;
 email: string;
 profilePhoto?: string | null;
 contactNumber?: string | null;
 createdAt: Date | string;
 user: {
  status: UserStatus;
  role: string;
 }
}

