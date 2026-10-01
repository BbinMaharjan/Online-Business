import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class LocalFileService {
  async uploadImage(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ url: string; publicId: string }> {
    const ext = path.extname(filename) || this.getExtensionFromMimeType(mimeType);
    const publicId = `${uuidv4()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, publicId);

    await fs.promises.writeFile(filePath, fileBuffer);

    const url = `/uploads/${publicId}`;

    return { url, publicId };
  }

  async deleteImage(publicId: string): Promise<boolean> {
    const filePath = path.join(UPLOAD_DIR, publicId);

    try {
      await fs.promises.access(filePath);
      await fs.promises.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getSignedUrl(publicId: string, expirySeconds = 3600): string {
    return `/uploads/${publicId}`;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    };
    return mimeToExt[mimeType] || ".bin";
  }
}

export const localFileService = new LocalFileService();