import apiClient from "@/lib/apiClient";
import type { ApiResponse, Settings } from "@/types";

export const settingsApi = {
  getSettings: () =>
    apiClient.get<ApiResponse<Settings>>("/settings"),

  updateSettings: (data: Partial<Settings>) =>
    apiClient.patch<ApiResponse<Settings>>("/settings", data),
};