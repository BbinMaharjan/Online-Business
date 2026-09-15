import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, AdminUser, Role, Permission } from "@/types";

export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const administratorApi = {
  getAdministrators: (filters: AdminFilters = {}) =>
    apiClient.get<PaginatedResponse<AdminUser>>("/users/admin/users", filters),

  getAdministratorById: (id: string) =>
    apiClient.get<ApiResponse<AdminUser>>(`/users/admin/users/${id}`),

  createAdministrator: (data: Partial<AdminUser> & { password: string }) =>
    apiClient.post<ApiResponse<AdminUser>>("/users/admin/users", data),

  updateAdministrator: (id: string, data: Partial<AdminUser>) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/users/admin/users/${id}`, data),

  deleteAdministrator: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/admin/users/${id}`),

  getRoles: () =>
    apiClient.get<ApiResponse<Role[]>>("/users/roles"),

  getPermissions: () =>
    apiClient.get<ApiResponse<Permission[]>>("/users/permissions"),
};