import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../api/paymentApi";
import type { Payment, PaymentFilters } from "@/types";

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export const usePaymentsQuery = (filters: PaymentFilters = {}) => {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => paymentApi.getPayments(filters),
    select: (response) => response.data,
  });
};

export const usePaymentQuery = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentApi.getPaymentById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount?: number }) =>
      paymentApi.refundPayment(paymentId, amount),
    onSuccess: (_, { paymentId }) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) });
    },
  });
};