"use server"

import { httpClient } from "@/lib/axios/httpClient";

export interface ILeaderboardUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  profilePhoto: string | null;
  _count: {
    products: number;
  };
}

export interface ILeaderboardResponse {
  success: boolean;
  message: string;
  data: ILeaderboardUser[];
}

/**
 * Fetches the user leaderboard from the server.
 */
export const getUserLeaderboard = async (): Promise<ILeaderboardResponse> => {
  try {
    const response = await httpClient.get<ILeaderboardUser[]>("/stats/user-leaderboard");
    return response as unknown as ILeaderboardResponse;
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch leaderboard.",
      data: [],
    };
  }
};

/**
 * Fetches dashboard statistics data.
 */
export const getDashboardStats = async (): Promise<any> => {
  try {
    const response = await httpClient.get("/stats");
    return response;
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch dashboard stats.",
      data: null,
    };
  }
};
