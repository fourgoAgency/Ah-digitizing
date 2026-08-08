// lib/uploadPortfolioFolder.ts
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type PortfolioCategory = "embroidery" | "vector";

export type UploadResult = {
  fileName: string;
  url: string;
};

export type UploadProgress = {
  fileName: string;
  progress: number; // 0–100
};

export type UploadPortfolioFolderOptions = {
  category: PortfolioCategory;
  files: File[];
  onProgress?: (update: UploadProgress) => void;
  onFileComplete?: (result: UploadResult) => void;
  onError?: (fileName: string, error: Error) => void;
};

/**
 * Uploads multiple files to Firebase Storage under the given portfolio category folder.
 * Files are uploaded concurrently. Per-file progress, completion, and error callbacks are supported.
 *
 * Storage path: `{category}/{timestamp}_{fileName}`
 *
 * @returns Array of { fileName, url } for every successfully uploaded file.
 */
/**
 * Downscales and re-encodes an image to WebP before upload. The raw PNGs
 * coming from the admin portal were ~1-3MB each, which made the public
 * portfolio grid (60+ images, lazy-loaded straight from Storage) take
 * minutes to fill. Compressed here they come out at ~50-150KB with no
 * visible quality loss at display size.
 */
async function compressImage(file: File, maxDim = 1280, quality = 0.82): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file; // fall back to the original if compression fails
  }
}

export async function uploadPortfolioFolder({
  category,
  files,
  onProgress,
  onFileComplete,
  onError,
}: UploadPortfolioFolderOptions): Promise<UploadResult[]> {
  if (!files.length) return [];

  const uploadFile = (file: File): Promise<UploadResult | null> => {
    return new Promise(async (resolve) => {
      const readyFile = await compressImage(file);
      // Prefix with timestamp to avoid collisions on re-uploads
      const fileName = `${Date.now()}_${readyFile.name}`;
      const storageRef = ref(storage, `${category}/${fileName}`);
      const task = uploadBytesResumable(storageRef, readyFile);

      task.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress?.({ fileName: file.name, progress });
        },
        (error) => {
          onError?.(file.name, error);
          resolve(null); // Don't throw — let other files continue
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          const result: UploadResult = { fileName: file.name, url };
          onFileComplete?.(result);
          resolve(result);
        }
      );
    });
  };

  const results = await Promise.all(files.map(uploadFile));

  // Filter out any nulls from failed uploads
  return results.filter((r): r is UploadResult => r !== null);
}

// hooks/usePortfolioUpload.ts
import { useState, useCallback } from "react";

type FileProgress = Record<string, number>; // fileName → 0-100

export function usePortfolioUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<FileProgress>({});
  const [results, setResults] = useState<UploadResult[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({}); // fileName → message

  const upload = useCallback(
    async (category: PortfolioCategory, files: File[]) => {
      setUploading(true);
      setProgress({});
      setResults([]);
      setErrors({});

      const uploaded = await uploadPortfolioFolder({
        category,
        files,
        onProgress: ({ fileName, progress: pct }) =>
          setProgress((prev) => ({ ...prev, [fileName]: pct })),
        onFileComplete: (result) =>
          setResults((prev) => [...prev, result]),
        onError: (fileName, error) =>
          setErrors((prev) => ({ ...prev, [fileName]: error.message })),
      });

      // Persist the storage URLs to Firestore (portfolioIndex/<category>) so the
      // public site can list them. Storage upload already succeeded — if this
      // sync fails, surface it instead of pretending the whole flow is done.
      if (uploaded.length > 0) {
        try {
          const res = await fetch("/api/admin/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              urls: uploaded.map((r) => r.url),
            }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || `Sync failed (${res.status})`);
          }
        } catch (err) {
          setErrors((prev) => ({
            ...prev,
            _firestore: `Files uploaded to storage but Firestore index not updated: ${
              err instanceof Error ? err.message : String(err)
            }`,
          }));
        }
      }

      setUploading(false);
      return uploaded;
    },
    []
  );

  return { upload, uploading, progress, results, errors };
}