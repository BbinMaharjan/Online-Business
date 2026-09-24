import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Category, PaginatedResponse } from "@/types";

const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (parentId?: string) => [...CATEGORY_KEYS.lists(), parentId] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
  detailBySlug: (slug: string) => [...CATEGORY_KEYS.details(), "slug", slug] as const,
};

export function useCategories(parentId?: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(parentId),
    queryFn: () => apiClient.categories.list(parentId),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => apiClient.categories.getById(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detailBySlug(slug),
    queryFn: () => apiClient.categories.getBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
}

export function usePrefetchCategory(slug: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.prefetchQuery({
      queryKey: CATEGORY_KEYS.detailBySlug(slug),
      queryFn: () => apiClient.categories.getBySlug(slug),
      staleTime: 60 * 60 * 1000,
    });
  };
}

export function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
}