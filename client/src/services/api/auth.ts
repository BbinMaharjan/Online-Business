import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Customer } from "@/types";
import toast from "react-hot-toast";

const AUTH_KEYS = {
  all: ["auth"] as const,
  user: () => [...AUTH_KEYS.all, "user"] as const,
};

export function useUser() {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: () => apiClient.auth.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string; rememberMe?: boolean }) =>
      apiClient.auth.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.user(), data.data);
      toast.success("Welcome back!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; email: string; password: string }) =>
      apiClient.auth.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.user(), data.data);
      toast.success("Account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.user(), null);
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => apiClient.auth.forgotPassword(email),
    onSuccess: () => {
      toast.success("Password reset email sent");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) => apiClient.auth.resetPassword(data.token, data.password),
    onSuccess: () => {
      toast.success("Password reset successful");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Password reset failed");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => apiClient.auth.updateProfile(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: AUTH_KEYS.user() });
      const previousUser = queryClient.getQueryData<Customer>(AUTH_KEYS.user());
      if (previousUser) {
        queryClient.setQueryData(AUTH_KEYS.user(), { ...previousUser, ...newData });
      }
      return { previousUser };
    },
    onError: (error, _, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(AUTH_KEYS.user(), context.previousUser);
      }
      toast.error(error.message || "Failed to update profile");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.auth.updateProfile({ password: data.newPassword, currentPassword: data.currentPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
}

export function useInvalidateAuth() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
}