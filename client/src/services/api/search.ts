import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product, ProductFilters, PaginatedResponse, SearchSuggestion } from "@/types";

const SEARCH_KEYS = {
  all: ["search"] as const,
  results: (query: string, filters?: ProductFilters) => [...SEARCH_KEYS.all, "results", query, filters] as const,
  suggestions: (query: string) => [...SEARCH_KEYS.all, "suggestions", query] as const,
};

export function useSearchProducts(query: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: SEARCH_KEYS.results(query, filters),
    queryFn: () => apiClient.search.products(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: SEARCH_KEYS.suggestions(query),
    queryFn: () => apiClient.search.suggestions(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvalidateSearch() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: SEARCH_KEYS.all });
}