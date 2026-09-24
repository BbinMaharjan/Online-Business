import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Payment, PaymentIntent } from "@/types";
import toast from "react-hot-toast";

const PAYMENT_KEYS = {
  all: ["payments"] as const,
  details: () => [...PAYMENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PAYMENT_KEYS.details(), id] as const,
};

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: { orderId: string; provider: string; method: "COD" | "CARD" | "WALLET" }) =>
      apiClient.payments.create(data.orderId, data.provider, data.method),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment");
    },
  });
}

export function usePaymentStatus(paymentId: string) {
  return useQuery({
    queryKey: PAYMENT_KEYS.detail(paymentId),
    queryFn: () => apiClient.payments.getStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.data?.status === "PENDING" || data?.data?.status === "PROCESSING") {
        return 5000;
      }
      return false;
    },
  });
}

export function usePollPaymentStatus(paymentId: string, onSuccess?: (payment: Payment) => void) {
  return useQuery({
    queryKey: [...PAYMENT_KEYS.detail(paymentId), "poll"],
    queryFn: () => apiClient.payments.getStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    retry: 3,
    onSuccess: (data) => {
      if (data.data?.status === "PAID" || data.data?.status === "FAILED") {
        onSuccess?.(data.data);
      }
    },
  });
}