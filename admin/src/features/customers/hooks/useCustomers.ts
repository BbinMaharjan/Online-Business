import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "../api/customerApi";
import type { User, Order, CustomerFilters } from "@/types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  orders: (id: string) => [...customerKeys.detail(id), "orders"] as const,
};

export const useCustomersQuery = (filters: CustomerFilters = {}) => {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customerApi.getCustomers(filters),
    select: (response) => response.data,
  });
};

export const useCustomerQuery = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getCustomerById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCustomerOrdersQuery = (id: string) => {
  return useQuery({
    queryKey: customerKeys.orders(id),
    queryFn: () => customerApi.getCustomerOrders(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useUpdateCustomerStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => customerApi.updateCustomerStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
    },
  });
};

export const useBlockCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => customerApi.blockCustomer(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
    },
  });
};