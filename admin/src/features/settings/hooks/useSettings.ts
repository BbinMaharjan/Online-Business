import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../api/settingsApi";
import type { Settings } from "@/types";

export const settingsKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
};

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () => settingsApi.getSettings(),
    select: (response) => response.data,
  });
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Settings>) => settingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
    },
  });
};