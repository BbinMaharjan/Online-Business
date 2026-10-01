import apiClient from "@/lib/apiClient";
import type { ApiResponse, Settings } from "@/types";

export const settingsApi = {
  getSettings: () =>
    apiClient.get<ApiResponse<Settings>>("/settings"),

  updateSettings: (data: Partial<Settings> | FormData) => {
    if (data instanceof FormData) {
      return apiClient.patchFormData<ApiResponse<Settings>>("/settings", data);
    }
    return apiClient.patch<ApiResponse<Settings>>("/settings", data);
  },
};