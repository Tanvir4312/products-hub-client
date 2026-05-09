"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, updateReview, deleteReview } from "@/services/reviewService";
import { toast } from "sonner";

export const useProductReview = (productId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number, comment: string }) => {
      return createReview(productId, rating, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review posted!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to post review.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, rating, comment }: { id: string, rating: number, comment: string }) => {
      return updateReview(id, rating, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review updated!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update review.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review deleted!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete review.");
    },
  });

  return {
    createReview: createMutation,
    updateReview: updateMutation,
    deleteReview: deleteMutation
  };
};
