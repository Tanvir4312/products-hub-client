"use client"

import { useQuery } from "@tanstack/react-query";
import { getUserLeaderboard } from "@/services/statsService";

export const useUserLeaderboard = () => {
  return useQuery({
    queryKey: ["user-leaderboard"],
    queryFn: async () => {
      const response = await getUserLeaderboard();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
