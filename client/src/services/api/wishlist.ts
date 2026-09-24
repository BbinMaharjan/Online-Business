import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { WishlistItem } from "@/types";
import toast from "react-hot-toast";

const WISHLIST_KEYS = {
  all: ["wishlist"] as const,
  lists: () => [...WISHLIST_KEYS.all, "list"] as const,
};

export function useWishlist() {
  return useQuery({
    queryKey: WISHLIST_KEYS.lists(),
    queryFn: () => apiClient.wishlist.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => apiClient.wishlist.add(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEYS.lists() });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEYS.lists());
      return { previousWishlist };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEYS.lists(), (old) => [...(old || []), data.data]);
      toast.success("Added to wishlist");
    },
    onError: (error, _, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_KEYS.lists(), context.previousWishlist);
      }
      toast.error(error.message || "Failed to add to wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.lists() });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => apiClient.wishlist.remove(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEYS.lists() });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEYS.lists());
      if (previousWishlist) {
        queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEYS.lists(), (old) =>
          old?.filter((item) => item.productId !== productId)
        );
      }
      return { previousWishlist };
    },
    onError: (error, _, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_KEYS.lists(), context.previousWishlist);
      }
      toast.error(error.message || "Failed to remove from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.lists() });
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { data: wishlist } = useWishlist();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  return (productId: string) => {
    const isInWishlist = wishlist?.data?.some((item) => item.productId === productId) ?? false;
    if (isInWishlist) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };
}

export function useInvalidateWishlist() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
}