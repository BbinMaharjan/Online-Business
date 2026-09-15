import { useQuery } from "@tanstack/react-query";
import { auditLogApi } from "../api/auditLogApi";
import type { AuditLog, AuditLogFilters } from "@/types";

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogKeys.all, "list"] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.lists(), filters] as const,
  details: () => [...auditLogKeys.all, "detail"] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
};

export const useAuditLogsQuery = (filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => auditLogApi.getAuditLogs(filters),
    select: (response) => response.data,
  });
};

export const useAuditLogQuery = (id: string) => {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => auditLogApi.getAuditLogById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};