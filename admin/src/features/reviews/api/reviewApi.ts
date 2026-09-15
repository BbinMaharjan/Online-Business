import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Review } from "@/types";

export interface ReviewFilters {
  page?: number;
  limit?: number;
  productId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const reviewApi = {
  getReviews: (filters: ReviewFilters = {}) =>
    apiClient.get<PaginatedResponse<Review>>("/reviews", filters),

  getProductReviews: (productId: string) =>
    apiClient.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`),

  updateReviewStatus: (reviewId: string, status: "APPROVED" | "REJECTED") =>
    apiClient.patch<ApiResponse<Review>>(`/reviews/admin/${reviewId}/status`, { status }),

  deleteReview: (reviewId: string) =>
    apiClient.delete<ApiResponse<void>>(`/reviews/admin/${reviewId}`),
};