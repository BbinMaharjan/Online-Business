import { useCallback, useState } from "react";
import { message } from "antd";
import { settingsApi } from "@/features/settings/api/settingsApi";
import { mediaApi } from "@/features/media/api/mediaApi";
import type { UploadFile } from "antd/es/upload/interface";

export type ImageUploadType = "settings" | "media";

export interface UseImageUploadOptions {
  type: ImageUploadType;
  settingsType?: "storeLogo" | "favicon";
  mediaOptions?: {
    referenceId: string;
    referenceType: string;
    mediaType?: "PRODUCT_IMAGE" | "CATEGORY_IMAGE" | "AVATAR" | "GENERIC";
    alt?: string;
  };
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = (options: UseImageUploadOptions) => {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File): Promise<string | undefined> => {
      setUploading(true);
      try {
        let url: string;

        if (options.type === "settings") {
          if (!options.settingsType) {
            throw new Error("settingsType is required for settings upload");
          }
          const response = await settingsApi.uploadImage(file, options.settingsType);
          url = response.data.data.url;
        } else {
          if (!options.mediaOptions?.referenceId || !options.mediaOptions?.referenceType) {
            throw new Error("referenceId and referenceType are required for media upload");
          }
          const response = await mediaApi.uploadMedia(
            file,
            options.mediaOptions.referenceId,
            options.mediaOptions.referenceType,
            options.mediaOptions.mediaType || "GENERIC",
            options.mediaOptions.alt
          );
          url = response.data.data.url;
        }

        options.onSuccess?.(url);
        return url;
      } catch (error) {
        const err = error as Error;
        message.error(err.message || "Failed to upload image");
        options.onError?.(err);
        return undefined;
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const handleUploadChange = useCallback(
    async (info: { fileList: UploadFile[] }) => {
      const file = info.fileList[info.fileList.length - 1]?.originFileObj as File;
      if (file) {
        await upload(file);
      }
    },
    [upload]
  );

  return { upload, handleUploadChange, uploading };
};