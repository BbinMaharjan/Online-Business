import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { administratorApi } from "../api/administratorApi";
import type { AdminUser, Role, Permission, AdminFilters } from "@/types";

export const administratorKeys = {
  all: ["administrators"] as const,
  lists: () => [...administratorKeys.all, "list"] as const,
  list: (filters: AdminFilters) => [...administratorKeys.lists(), filters] as const,
  details: () => [...administratorKeys.all, "detail"] as const,
  detail: (id: string) => [...administratorKeys.details(), id] as const,
  roles: () => [...administratorKeys.all, "roles"] as const,
  permissions: () => [...administratorKeys.all, "permissions"] as const,
};

export const useAdministratorsQuery = (filters: AdminFilters = {}) => {
  return useQuery({
    queryKey: administratorKeys.list(filters),
    queryFn: () => administratorApi.getAdministrators(filters),
    select: (response) => response.data,
  });
};

export const useAdministratorQuery = (id: string) => {
  return useQuery({
    queryKey: administratorKeys.detail(id),
    queryFn: () => administratorApi.getAdministratorById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateAdministratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminUser> & { password: string }) => administratorApi.createAdministrator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: administratorKeys.lists() });
    },
  });
};

export const useUpdateAdministratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUser> }) => administratorApi.updateAdministrator(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: administratorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: administratorKeys.detail(id) });
    },
  });
};

export const useDeleteAdministratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => administratorApi.deleteAdministrator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: administratorKeys.lists() });
    },
  });
};

export const useRolesQuery = () => {
  return useQuery({
    queryKey: administratorKeys.roles(),
    queryFn: () => administratorApi.getRoles(),
    select: (response) => response.data,
  });
};

export const usePermissionsQuery = () => {
  return useQuery({
    queryKey: administratorKeys.permissions(),
    queryFn: () => administratorApi.getPermissions(),
    select: (response) => response.data,
  });
};