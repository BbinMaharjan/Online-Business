import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Cart, CartItem, CartMutationResult } from "@/types";
import toast from "react-hot-toast";

const CART_KEYS = {
  all: ["cart"] as const,
  detail: () => [...CART_KEYS.all, "detail"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: CART_KEYS.detail(),
    queryFn: () => apiClient.cart.get(),
    staleTime: 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId?: string; quantity?: number }) =>
      apiClient.cart.addItem(productId, variantId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.detail(), data);
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiClient.cart.updateItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEYS.detail() });
      const previousCart = queryClient.getQueryData<Cart>(CART_KEYS.detail());
      if (previousCart) {
        queryClient.setQueryData<Cart>(CART_KEYS.detail(), {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item._id === itemId ? { ...item, quantity, subtotal: item.price * quantity } : item
          ),
        });
      }
      return { previousCart };
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_KEYS.detail(), context.previousCart);
      }
      toast.error(error.message || "Failed to update cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.detail() });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => apiClient.cart.removeItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_KEYS.detail() });
      const previousCart = queryClient.getQueryData<Cart>(CART_KEYS.detail());
      if (previousCart) {
        queryClient.setQueryData<Cart>(CART_KEYS.detail(), {
          ...previousCart,
          items: previousCart.items.filter((item) => item._id !== itemId),
        });
      }
      return { previousCart };
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_KEYS.detail(), context.previousCart);
      }
      toast.error(error.message || "Failed to remove from cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.detail() });
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => apiClient.cart.applyCoupon(code),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.detail(), data);
      toast.success("Coupon applied");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid coupon code");
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.cart.removeCoupon(),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.detail(), data);
      toast.success("Coupon removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove coupon");
    },
  });
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
}