"use client"

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/productService";
import { ISingleProductResponse } from "@/types/product.types";

/**
 * Custom hook to fetch a single product by ID using React Query.
 * This abstracts the query logic and provides a clean interface for the details page.
 */
export const useSingleProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      const response: ISingleProductResponse = await getProductById(id);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
