import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/reviewApi";
import type { Review, ReviewFilters } from "@/types";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: ReviewFilters) => [...reviewKeys.lists(), filters] as const,
  productReviews: (productId: string) => [...reviewKeys.all, "product", productId] as const,
};

export const useReviewsQuery = (filters: ReviewFilters = {}) => {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => reviewApi.getReviews(filters),
    select: (response) => response.data,
  });
};

export const useProductReviewsQuery = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.productReviews(productId),
    queryFn: () => reviewApi.getProductReviews(productId),
    select: (response) => response.data,
    enabled: !!productId,
  });
};

export const useUpdateReviewStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, status }: { reviewId: string; status: "APPROVED" | "REJECTED" }) =>
      reviewApi.updateReviewStatus(reviewId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};