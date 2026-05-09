"use client"

import { useQuery } from "@tanstack/react-query";
import { getActiveCoupons } from "@/services/couponService";

export const useActiveCoupons = (limit: number = 4) => {
  return useQuery({
    queryKey: ["active-coupons", limit],
    queryFn: async () => {
      const response = await getActiveCoupons(limit);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
