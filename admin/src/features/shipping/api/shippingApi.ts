import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, ShippingMethod } from "@/types";

export const shippingApi = {
  getShippingMethods: () =>
    apiClient.get<ApiResponse<ShippingMethod[]>>("/shipping"),

  getShippingMethodById: (id: string) =>
    apiClient.get<ApiResponse<ShippingMethod>>(`/shipping/${id}`),

  calculateShipping: (data: { items: Array<{ productId: string; quantity: number }>; address: any }) =>
    apiClient.post<ApiResponse<{ shippingFee: number; estimatedDelivery: string }>>("/shipping/calculate", data),
};