import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Order } from "@/types";

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  paymentStatus?: string;
  orderStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const orderApi = {
  getOrders: (filters: OrderFilters = {}) =>
    apiClient.get<PaginatedResponse<Order>>("/orders", filters),

  getOrderById: (id: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  updateOrderStatus: (id: string, orderStatus: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { orderStatus }),

  updateShippingStatus: (id: string, shippingStatus: string, trackingNumber?: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/shipping`, { shippingStatus, trackingNumber }),

  cancelOrder: (id: string, reason: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason }),

  processRefund: (id: string, amount: number, reason: string) =>
    apiClient.post<ApiResponse<Order>>(`/orders/${id}/refund`, { amount, reason }),
};