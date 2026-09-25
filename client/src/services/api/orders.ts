import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order, PaginatedResponse, ShippingMethod } from "@/types";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import toast from "react-hot-toast";

const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; status?: string }) => [...ORDER_KEYS.lists(), params] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
  shippingMethods: () => [...ORDER_KEYS.all, "shipping-methods"] as const,
};

export function useOrders(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => apiClient.orders.list(params),
    staleTime: 30 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => apiClient.orders.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useShippingMethods() {
  return useQuery({
    queryKey: ORDER_KEYS.shippingMethods(),
    queryFn: () => apiClient.orders.getShippingMethods(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { shippingAddressId: string; billingAddressId?: string; shippingMethodId: string; paymentMethod: string; coupon?: string; notes?: string }) =>
      apiClient.orders.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order placed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.orders.cancel(id),
    onSuccess: (data) => {
      queryClient.setQueryData(ORDER_KEYS.detail(data.data._id), data);
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      toast.success("Order cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => apiClient.orders.refund(id, reason),
    onSuccess: (data) => {
      queryClient.setQueryData(ORDER_KEYS.detail(data.data._id), data);
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      toast.success("Refund requested");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to request refund");
    },
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
}