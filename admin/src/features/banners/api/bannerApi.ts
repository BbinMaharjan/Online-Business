import apiClient from "@/lib/apiClient";
import type { ApiResponse, PaginatedResponse, Banner } from "@/types";

export interface BannerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BannerFormData {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
}

export const bannerApi = {
  getBanners: (filters?: BannerFilters) =>
    apiClient.get<PaginatedResponse<Banner>>("/banners", { params: filters }),

  getBannerById: (id: string) =>
    apiClient.get<ApiResponse<Banner>>(`/banners/${id}`),

  createBanner: (data: BannerFormData) =>
    apiClient.post<ApiResponse<Banner>>("/banners", data),

  updateBanner: (id: string, data: Partial<BannerFormData>) =>
    apiClient.patch<ApiResponse<Banner>>(`/banners/${id}`, data),

  deleteBanner: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/banners/${id}`),
};