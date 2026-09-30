import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  baseUrl: string;
}

interface CloudflareUploadResponse {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: unknown[];
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
}

interface CloudflareDeleteResponse {
  success: boolean;
  errors: unknown[];
  messages: unknown[];
  result: { id: string };
}

class CloudflareService {
  private config: CloudflareConfig;

  constructor() {
    this.config = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
      apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
      baseUrl: "https://api.cloudflare.com/client/v4",
    };
  }

  private async uploadToCloudflare(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<CloudflareUploadResponse> {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append("file", blob, filename);
    formData.append("requireSignedURLs", "false");

    const response = await fetch(
      `${this.config.baseUrl}/accounts/${this.config.accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
        },
        body: formData,
      }
    );

    return response.json() as Promise<CloudflareUploadResponse>;
  }

  async uploadImage(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ url: string; publicId: string }> {
    if (!this.config.accountId || !this.config.apiToken) {
      throw new Error("Cloudflare credentials not configured");
    }

    const response = await this.uploadToCloudflare(fileBuffer, filename, mimeType);

    if (!response.success) {
      throw new Error(
        `Cloudflare upload failed: ${response.errors.map((e) => e.message).join(", ")}`
      );
    }

    const variantUrl = response.result.variants[0];
    if (!variantUrl) {
      throw new Error("No variant URL returned from Cloudflare");
    }

    return {
      url: variantUrl,
      publicId: response.result.id,
    };
  }

  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.config.accountId || !this.config.apiToken) {
      throw new Error("Cloudflare credentials not configured");
    }

    const response = await fetch(
      `${this.config.baseUrl}/accounts/${this.config.accountId}/images/v1/${publicId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
        },
      }
    );

    const data = (await response.json()) as CloudflareDeleteResponse;
    return data.success;
  }

  getSignedUrl(publicId: string, expirySeconds = 3600): string {
    // For signed URLs, you would implement Cloudflare's signed URL generation
    // This is a simplified version - in production, use Cloudflare's signed URL API
    return `https://imagedelivery.net/${this.config.accountId}/${publicId}/public`;
  }
}

export const cloudflareService = new CloudflareService();