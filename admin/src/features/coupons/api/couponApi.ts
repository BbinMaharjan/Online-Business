import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Coupon } from "@/types";

export interface CouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const couponApi = {
  getCoupons: (filters: CouponFilters = {}) =>
    apiClient.get<PaginatedResponse<Coupon>>("/coupons", filters),

  getCouponByCode: (code: string) =>
    apiClient.get<ApiResponse<Coupon>>(`/coupons/${code}`),

  validateCoupon: (code: string, orderTotal: number) =>
    apiClient.post<ApiResponse<Coupon>>(`/coupons/validate/${code}`, { orderTotal }),

  createCoupon: (data: Partial<Coupon>) =>
    apiClient.post<ApiResponse<Coupon>>("/coupons", data),

  updateCoupon: (code: string, data: Partial<Coupon>) =>
    apiClient.patch<ApiResponse<Coupon>>(`/coupons/${code}`, data),

  deleteCoupon: (code: string) =>
    apiClient.delete<ApiResponse<void>>(`/coupons/${code}`),
};