import apiClient from "@/lib/apiClient";
import type { ApiResponse, DashboardSummary, ProductReport, CategoryReport, RecentOrder, LowStockProduct } from "@/types";

export const dashboardApi = {
  getSummary: () =>
    apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary"),

  getBestSellingProducts: (limit = 10) =>
    apiClient.get<ApiResponse<ProductReport[]>>(`/dashboard/best-selling-products?limit=${limit}`),

  getBestPerformingCategories: (limit = 10) =>
    apiClient.get<ApiResponse<CategoryReport[]>>(`/dashboard/best-performing-categories?limit=${limit}`),

  getRecentOrders: (limit = 10) =>
    apiClient.get<ApiResponse<RecentOrder[]>>(`/dashboard/recent-orders?limit=${limit}`),

  getLowStockProducts: (limit = 10) =>
    apiClient.get<ApiResponse<LowStockProduct[]>>(`/dashboard/low-stock-products?limit=${limit}`),
};