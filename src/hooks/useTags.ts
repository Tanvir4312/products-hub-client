"use client"

import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@/services/tagService";

export const useTags = (name?: string) => {
  return useQuery({
    queryKey: ["tags", name],
    queryFn: async () => {
      const response = await getAllTags(name);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },

    staleTime: 1000 * 60 * 60, // Tags don't change often, keep for 1 hour
  });
};
