import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Category } from "@/types";

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const categoryApi = {
  getCategories: (filters: CategoryFilters = {}) =>
    apiClient.get<PaginatedResponse<Category>>("/categories", filters),

  getCategoryById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  getCategoryBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`),

  getCategoryTree: () =>
    apiClient.get<ApiResponse<Category[]>>("/categories/tree"),

  createCategory: (data: Partial<Category>) =>
    apiClient.post<ApiResponse<Category>>("/categories", data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/categories/${id}`),
};