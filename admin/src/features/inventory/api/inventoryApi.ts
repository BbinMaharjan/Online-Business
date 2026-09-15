import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Inventory } from "@/types";

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  lowStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StockAdjustment {
  productId: string;
  variantId?: string;
  adjustmentType: "ADD" | "REMOVE" | "SET";
  quantity: number;
  reason: "RESTOCK" | "DAMAGED" | "LOST" | "MANUAL_ADJUSTMENT" | "RETURN" | "CORRECTION";
}

export const inventoryApi = {
  getInventory: (filters: InventoryFilters = {}) =>
    apiClient.get<PaginatedResponse<Inventory>>("/inventory", filters),

  getInventoryByProduct: (productId: string) =>
    apiClient.get<ApiResponse<Inventory>>(`/inventory/product/${productId}`),

  adjustStock: (data: StockAdjustment) =>
    apiClient.post<ApiResponse<Inventory>>("/inventory/adjust", data),

  reserveStock: (productId: string, variantId: string | undefined, quantity: number) =>
    apiClient.post<ApiResponse<Inventory>>("/inventory/reserve", { productId, variantId, quantity }),

  releaseStock: (productId: string, variantId: string | undefined, quantity: number) =>
    apiClient.post<ApiResponse<Inventory>>("/inventory/release", { productId, variantId, quantity }),
};