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
export async function uploadPortfolioFolder({
  category,
  files,
  onProgress,
  onFileComplete,
  onError,
}: UploadPortfolioFolderOptions): Promise<UploadResult[]> {
  if (!files.length) return [];

  const uploadFile = (file: File): Promise<UploadResult | null> => {
    return new Promise((resolve) => {
      // Prefix with timestamp to avoid collisions on re-uploads
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${category}/${fileName}`);
      const task = uploadBytesResumable(storageRef, file);

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

      setUploading(false);
      return uploaded;
    },
    []
  );

  return { upload, uploading, progress, results, errors };
}