import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandApi } from "../api/brandApi";
import type { Brand, BrandFilters } from "@/types";

export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters: BrandFilters) => [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export const useBrandsQuery = (filters: BrandFilters = {}) => {
  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: () => brandApi.getBrands(filters),
    select: (response) => response.data,
  });
};

export const useBrandQuery = (id: string) => {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandApi.getBrandById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Brand>) => brandApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) => brandApi.updateBrand(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};