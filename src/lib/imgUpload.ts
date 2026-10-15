/**
 * Grocify ImgBB Client-Side Image Upload Helper
 *
 * Uses NEXT_PUBLIC_IMGBB_KEY configured in .env.
 * Validates file presence, mime-type, and size before initiating network request.
 * Returns hosted image object containing direct URL and display URL.
 */

export interface ImgBBUploadResult {
  url: string;
  display_url?: string;
  delete_url?: string;
  title?: string;
  size?: number;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function uploadToImgBB(file: File): Promise<ImgBBUploadResult> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "ImgBB API key is not configured. Please verify NEXT_PUBLIC_IMGBB_KEY in your environment."
    );
  }

  if (!file) {
    throw new Error("No image file selected for upload.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type (${file.type || "unknown"}). Please select a JPG, PNG, WEBP, GIF, or AVIF image.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey.trim())}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.success) {
    const errorDetail =
      json?.error?.message ||
      json?.message ||
      `Upload failed with HTTP ${response.status}`;
    throw new Error(`ImgBB upload error: ${errorDetail}`);
  }

  const data = json.data;
  return {
    url: data.display_url || data.url,
    display_url: data.display_url,
    delete_url: data.delete_url,
    title: data.title,
    size: data.size,
  };
}

// Backward compatibility default helper
export const imageUpload = async (image: File) => {
  const res = await uploadToImgBB(image);
  return res;
};
