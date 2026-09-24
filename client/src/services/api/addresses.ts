import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Address } from "@/types";
import toast from "react-hot-toast";

const ADDRESS_KEYS = {
  all: ["addresses"] as const,
  lists: () => [...ADDRESS_KEYS.all, "list"] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESS_KEYS.lists(),
    queryFn: () => apiClient.addresses.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Address, "_id">) => apiClient.addresses.create(data),
    onSuccess: (data) => {
      queryClient.setQueryData<Address[]>(ADDRESS_KEYS.lists(), (old) => [...(old || []), data.data]);
      toast.success("Address added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add address");
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) => apiClient.addresses.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ADDRESS_KEYS.lists() });
      const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESS_KEYS.lists());
      if (previousAddresses) {
        queryClient.setQueryData<Address[]>(ADDRESS_KEYS.lists(), (old) =>
          old?.map((addr) => (addr._id === id ? { ...addr, ...data } : addr))
        );
      }
      return { previousAddresses };
    },
    onError: (error, _, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(ADDRESS_KEYS.lists(), context.previousAddresses);
      }
      toast.error(error.message || "Failed to update address");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.addresses.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADDRESS_KEYS.lists() });
      const previousAddresses = queryClient.getQueryData<Address[]>(ADDRESS_KEYS.lists());
      if (previousAddresses) {
        queryClient.setQueryData<Address[]>(ADDRESS_KEYS.lists(), (old) => old?.filter((addr) => addr._id !== id));
      }
      return { previousAddresses };
    },
    onError: (error, _, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(ADDRESS_KEYS.lists(), context.previousAddresses);
      }
      toast.error(error.message || "Failed to delete address");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
    },
  });
}

export function useInvalidateAddresses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
}