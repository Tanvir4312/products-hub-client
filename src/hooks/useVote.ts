"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { voteProduct, unvoteProduct } from "@/services/voteService";
import { useUser } from "./useUser";
import { toast } from "sonner";

export const useProductVote = (productId: string) => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  return useMutation({
    mutationFn: async ({ hasVoted }: { hasVoted: boolean }) => {
      if (hasVoted) {
        return unvoteProduct(productId);
      }
      return voteProduct(productId);
    },
    onMutate: async ({ hasVoted }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });
      await queryClient.cancelQueries({ queryKey: ["product", productId] });

      // Snapshot the previous state of all related queries
      const queryCache = queryClient.getQueryCache();
      const productsQueries = queryCache.findAll({ queryKey: ["products"] });
      const previousProduct = queryClient.getQueryData(["product", productId]);

      // Optimistically update all "products" queries (search, filters, etc.)
      productsQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old) return old;
          
          // Handle both array responses and object responses with data.data
          const productsArray = Array.isArray(old) ? old : old?.data?.data;
          if (!productsArray) return old;

          const newArray = productsArray.map((p: any) => {
            if (p.id === productId) {
              const currentVotes = p._count?.votedUsers ?? 0;
              const newCount = hasVoted ? currentVotes - 1 : currentVotes + 1;
              const currentVotedUsers = p.votedUsers ?? [];
              const newVotedUsers = hasVoted 
                ? currentVotedUsers.filter((v: any) => v.userId !== user?.id)
                : [...currentVotedUsers, { userId: user?.id }];
              
              return {
                ...p,
                _count: { ...p._count, votedUsers: Math.max(0, newCount) },
                votedUsers: newVotedUsers
              };
            }
            return p;
          });

          if (Array.isArray(old)) return newArray;
          return { ...old, data: { ...old.data, data: newArray } };
        });
      });

      // Optimistically update the single product query
      queryClient.setQueryData(["product", productId], (old: any) => {
        if (!old) return old;
        const currentVotes = old._count?.votedUsers ?? 0;
        const newCount = hasVoted ? currentVotes - 1 : currentVotes + 1;
        const currentVotedUsers = old.votedUsers ?? [];
        const newVotedUsers = hasVoted 
          ? currentVotedUsers.filter((v: any) => v.userId !== user?.id)
          : [...currentVotedUsers, { userId: user?.id }];

        return {
          ...old,
          _count: { ...old._count, votedUsers: Math.max(0, newCount) },
          votedUsers: newVotedUsers
        };
      });

      return { previousProduct };
    },
    onError: (err, variables, context: any) => {
      // Rollback the single product view
      queryClient.setQueryData(["product", productId], context.previousProduct);
      // Invalidate all products to force a refetch on error
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.error("Sync failed. Rolling back.");
    },
    onSuccess: (_data, variables) => {
      // Only broadcast when voting (not unvoting)
      if (!variables.hasVoted) {
        // Get product name from cache
        const product = queryClient.getQueryData<any>(["product", productId]);
        const productName = product?.name || "a product";
        
        // Broadcast to activity feed
        fetch('/api/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'upvote',
            data: {
              userName: user?.name || 'A user',
              productName: productName,
              timestamp: new Date().toISOString()
            }
          })
        }).catch(() => {
          // Silent fail - broadcasting is best-effort
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to keep server and client in sync
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }
  });
};
