import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "@/services/reviewService";
import { IReview } from "@/types/product.types";

/**
 * Custom hook to fetch the logged-in user's reviews.
 */
export const useMyReviews = () => {
  return useQuery<IReview[]>({
    queryKey: ["reviews", "my"],
    queryFn: async () => {
      const response = await getMyReviews();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
