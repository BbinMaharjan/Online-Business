import apiClient from "@/lib/apiClient";
import type { ApiResponse, SalesReport, ProductReport, CategoryReport, CustomerReport } from "@/types";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  period?: "today" | "yesterday" | "7d" | "30d" | "this_month" | "last_month" | "custom";
}

export const reportApi = {
  getSalesReport: (filters: ReportFilters = {}) =>
    apiClient.get<ApiResponse<SalesReport[]>>("/reports/sales", filters),

  getProductReport: (filters: ReportFilters = {}) =>
    apiClient.get<ApiResponse<ProductReport[]>>("/reports/products", filters),

  getCategoryReport: (filters: ReportFilters = {}) =>
    apiClient.get<ApiResponse<CategoryReport[]>>("/reports/categories", filters),

  getCustomerReport: (filters: ReportFilters = {}) =>
    apiClient.get<ApiResponse<CustomerReport[]>>("/reports/customers", filters),
};