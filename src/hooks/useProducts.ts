import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getMyProducts } from "@/services/productService";
import { IProduct, IProductResponse } from "@/types/product.types";

/**
 * Custom hook to fetch products using React Query.
 * Dynamically identifies featured products or returns all approved innovations.
 */
export const useFeaturedProducts = (filters?: Record<string, any>, options?: { showAll?: boolean }) => {
  return useQuery<IProduct[]>({
    queryKey: ["products", filters, options],
    queryFn: async () => {
      const response: IProductResponse = await getAllProducts({ 
        status: 'APPROVED',
        isFeatured: options?.showAll ? undefined : true,
        ...filters 
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response?.data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMostVotedProducts = (limit: number = 8) => {
  return useQuery<IProduct[]>({
    queryKey: ["products", "most-voted", limit],
    queryFn: async () => {
      const response: IProductResponse = await getAllProducts({ 
        status: 'APPROVED',
        sortBy: 'votes',
        sortOrder: 'desc',
        limit
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response?.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useNewReleases = (limit: number = 8) => {
  return useQuery<IProduct[]>({
    queryKey: ["products", "new-releases", limit],
    queryFn: async () => {
      const response: IProductResponse = await getAllProducts({ 
        status: 'APPROVED',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response?.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProducts = (params?: Record<string, any>) => {
  return useQuery<IProductResponse["data"]>({
    queryKey: ["products", "all", params],
    queryFn: async () => {
      const response: IProductResponse = await getAllProducts({
        status: 'APPROVED',
        ...params
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyProducts = (params?: Record<string, any>) => {
  return useQuery<IProductResponse["data"]>({
    queryKey: ["products", "my", params],
    queryFn: async () => {
      const response: IProductResponse = await getMyProducts(params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
