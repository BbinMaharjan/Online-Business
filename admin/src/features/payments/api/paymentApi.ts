import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Payment } from "@/types";

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const paymentApi = {
  getPayments: (filters: PaymentFilters = {}) =>
    apiClient.get<PaginatedResponse<Payment>>("/payments", filters),

  getPaymentById: (id: string) =>
    apiClient.get<ApiResponse<Payment>>(`/payments/${id}`),

  refundPayment: (paymentId: string, amount?: number) =>
    apiClient.post<ApiResponse<Payment>>(`/payments/${paymentId}/refund`, { amount }),
};