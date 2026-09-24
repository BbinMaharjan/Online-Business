import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Brand } from "@/types";

const BRAND_KEYS = {
  all: ["brands"] as const,
  lists: () => [...BRAND_KEYS.all, "list"] as const,
  details: () => [...BRAND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BRAND_KEYS.details(), id] as const,
  detailBySlug: (slug: string) => [...BRAND_KEYS.details(), "slug", slug] as const,
};

export function useBrands() {
  return useQuery({
    queryKey: BRAND_KEYS.lists(),
    queryFn: () => apiClient.brands.list(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: BRAND_KEYS.detail(id),
    queryFn: () => apiClient.brands.getById(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: BRAND_KEYS.detailBySlug(slug),
    queryFn: () => apiClient.brands.getBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
}

export function useInvalidateBrands() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: BRAND_KEYS.all });
}