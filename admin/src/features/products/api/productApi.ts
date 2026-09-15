import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Product, Variant } from "@/types";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const productApi = {
  getProducts: (filters: ProductFilters = {}) =>
    apiClient.get<PaginatedResponse<Product>>("/products", filters),

  getProductById: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  getProductBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`),

  createProduct: (data: Partial<Product>) =>
    apiClient.post<ApiResponse<Product>>("/products", data),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/products/${id}`),
};