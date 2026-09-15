import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, AuditLog } from "@/types";

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const auditLogApi = {
  getAuditLogs: (filters: AuditLogFilters = {}) =>
    apiClient.get<PaginatedResponse<AuditLog>>("/audit-logs", filters),

  getAuditLogById: (id: string) =>
    apiClient.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`),
};