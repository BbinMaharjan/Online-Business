import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Brand } from "@/types";

export interface BrandFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const brandApi = {
  getBrands: (filters: BrandFilters = {}) =>
    apiClient.get<PaginatedResponse<Brand>>("/brands", filters),

  getBrandById: (id: string) =>
    apiClient.get<ApiResponse<Brand>>(`/brands/${id}`),

  getBrandBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Brand>>(`/brands/slug/${slug}`),

  createBrand: (data: Partial<Brand>) =>
    apiClient.post<ApiResponse<Brand>>("/brands", data),

  updateBrand: (id: string, data: Partial<Brand>) =>
    apiClient.patch<ApiResponse<Brand>>(`/brands/${id}`, data),

  deleteBrand: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/brands/${id}`),
};