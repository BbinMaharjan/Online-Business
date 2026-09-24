import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product, ProductFilters, PaginatedResponse, Category, Brand, SearchSuggestion } from "@/types";

const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (filters: ProductFilters) => [...PRODUCT_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
  detailBySlug: (slug: string) => [...PRODUCT_KEYS.details(), "slug", slug] as const,
  reviews: (productId: string) => [...PRODUCT_KEYS.all, "reviews", productId] as const,
};

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters || {}),
    queryFn: () => apiClient.products.list(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => apiClient.products.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detailBySlug(slug),
    queryFn: () => apiClient.products.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductReviews(productId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: PRODUCT_KEYS.reviews(productId),
    queryFn: () => apiClient.products.getReviews(productId, params),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePrefetchProduct(slug: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.detailBySlug(slug),
      queryFn: () => apiClient.products.getBySlug(slug),
      staleTime: 5 * 60 * 1000,
    });
  };
}

export function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
}