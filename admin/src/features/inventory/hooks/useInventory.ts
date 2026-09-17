import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventoryApi";
import type { Inventory, InventoryFilters, StockAdjustment } from "@/types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: InventoryFilters) => [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (productId: string) => [...inventoryKeys.details(), productId] as const,
};

export const useInventoryQuery = (filters: InventoryFilters = {}) => {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => inventoryApi.getInventory(filters),
    select: (response) => {
      const res = response.data;
      return {
        items: res.items || [],
        pagination: res.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0,
        },
      };
    },
  });
};

export const useInventoryByProductQuery = (productId: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(productId),
    queryFn: () => inventoryApi.getInventoryByProduct(productId),
    select: (response) => response.data,
    enabled: !!productId,
  });
};

export const useAdjustStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StockAdjustment) => inventoryApi.adjustStock(data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(productId) });
    },
  });
};

export const useReserveStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId?: string; quantity: number }) =>
      inventoryApi.reserveStock(productId, variantId, quantity),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(productId) });
    },
  });
};

export const useReleaseStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId?: string; quantity: number }) =>
      inventoryApi.releaseStock(productId, variantId, quantity),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(productId) });
    },
  });
};