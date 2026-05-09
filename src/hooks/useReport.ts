"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportProduct } from "@/services/reportService";
import { toast } from "sonner";

export const useProductReport = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reason: string) => {
      return reportProduct(productId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Report done");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to report product.");
    },
  });
};
