import { useQuery, useQueryClient } from "@tanstack/react-query";
import { shippingApi } from "../api/shippingApi";
import type { ShippingMethod } from "@/types";

export const shippingKeys = {
  all: ["shipping"] as const,
  lists: () => [...shippingKeys.all, "list"] as const,
  details: () => [...shippingKeys.all, "detail"] as const,
  detail: (id: string) => [...shippingKeys.details(), id] as const,
};

export const useShippingMethodsQuery = () => {
  return useQuery({
    queryKey: shippingKeys.lists(),
    queryFn: () => shippingApi.getShippingMethods(),
    select: (response) => response.data,
  });
};

export const useShippingMethodQuery = (id: string) => {
  return useQuery({
    queryKey: shippingKeys.detail(id),
    queryFn: () => shippingApi.getShippingMethodById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};