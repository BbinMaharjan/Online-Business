import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, User, Order } from "@/types";

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const customerApi = {
  getCustomers: (filters: CustomerFilters = {}) =>
    apiClient.get<PaginatedResponse<User>>("/users", filters),

  getCustomerById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  getCustomerOrders: (id: string) =>
    apiClient.get<ApiResponse<Order[]>>(`/users/${id}/orders`),

  updateCustomerStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { status }),

  blockCustomer: (id: string, reason: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/block`, { reason }),
};