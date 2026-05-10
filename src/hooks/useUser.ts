"use client"

import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/authService";

export const useUser = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const user = await getUserInfo();
      return user;
    },
    staleTime: 0,
  });
};
