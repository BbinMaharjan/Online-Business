import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedResponse } from "@/types";
import toast from "react-hot-toast";

const REVIEW_KEYS = {
  all: ["reviews"] as const,
  lists: (productId: string) => [...REVIEW_KEYS.all, "list", productId] as const,
  details: () => [...REVIEW_KEYS.all, "detail"] as const,
  detail: (id: string) => [...REVIEW_KEYS.details(), id] as const,
};

export function useProductReviews(productId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: REVIEW_KEYS.lists(productId),
    queryFn: () => apiClient.reviews.list(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: string; rating: number; title?: string; comment: string; images?: string[] }) =>
      apiClient.reviews.create(data.productId, { rating: data.rating, title: data.title, comment: data.comment, images: data.images }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.lists(variables.productId) });
      queryClient.invalidateQueries({ queryKey: ["products", "detail", variables.productId] });
      toast.success("Review submitted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; rating?: number; title?: string; comment?: string; images?: string[] }) =>
      apiClient.reviews.update(data.id, { rating: data.rating, title: data.title, comment: data.comment, images: data.images }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.lists(data.data.productId) });
      toast.success("Review updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.reviews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}

export function useInvalidateReviews() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
}