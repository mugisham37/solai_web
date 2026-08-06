"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import type { UploadingFile } from "@/types/build";
import { convertHeicToJpeg } from "@/lib/image/heic";
import { processImageFile } from "@/lib/image/process";
import { uploadWithRetry } from "@/lib/image/upload";
import { formatBytes, validateImageFiles } from "@/lib/image/validate";

type UseImagePipelineOptions = {
  draftId: string;
  onFileUpdate: (file: UploadingFile) => void;
  onFirstLanded?: (url: string) => void;
};

export function useImagePipeline({
  draftId,
  onFileUpdate,
  onFirstLanded,
}: UseImagePipelineOptions) {
  const firstLandedRef = useRef(false);
  const [rejections, setRejections] = useState<string[]>([]);

  const processQueue = useCallback(
    async (incoming: File[]) => {
      const { accepted, rejected } = validateImageFiles(incoming);
      setRejections(rejected.map((r) => (r.ok ? "" : r.message)).filter(Boolean));

      for (const item of accepted) {
        if (!item.ok) continue;
        let file = item.file;
        const id = nanoid();
        let previewUrl: string | undefined;
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          previewUrl = undefined;
        }

        const base: UploadingFile = {
          id,
          fileName: file.name,
          status: "processing",
          progress: 0,
          originalFileSize: file.size,
          previewUrl,
          retryCount: 0,
        };
        onFileUpdate(base);

        try {
          if (item.isHeic) {
            const jpeg = await convertHeicToJpeg(file);
            file = new File([jpeg], file.name.replace(/\.heic$/i, ".jpg"), {
              type: "image/jpeg",
            });
          }
          const processed = await processImageFile(file);
          const processedFile = new File([processed.blob], file.name, {
            type: processed.mimeType,
          });
          onFileUpdate({
            ...base,
            status: "uploading",
            progress: 0,
            compressedFileSize: processed.compressedFileSize,
            originalFileSize: processed.originalFileSize,
          });

          const remoteUrl = await uploadWithRetry(
            draftId,
            file.name,
            processedFile,
            (progress) => {
              onFileUpdate({
                ...base,
                status: "uploading",
                progress,
                compressedFileSize: processed.compressedFileSize,
                originalFileSize: processed.originalFileSize,
              });
            },
          );

          onFileUpdate({
            ...base,
            status: "done",
            progress: 100,
            remoteUrl,
            compressedFileSize: processed.compressedFileSize,
            originalFileSize: processed.originalFileSize,
          });

          if (!firstLandedRef.current) {
            firstLandedRef.current = true;
            onFirstLanded?.(remoteUrl);
          }
        } catch {
          onFileUpdate({
            ...base,
            status: "failed",
            progress: base.progress,
            error: "Upload failed",
          });
        }
      }
    },
    [draftId, onFileUpdate, onFirstLanded],
  );

  const retryFile = useCallback(
    async (file: UploadingFile, blob: Blob, fileName: string) => {
      const updated: UploadingFile = {
        ...file,
        status: "uploading",
        progress: 0,
        retryCount: file.retryCount + 1,
        error: undefined,
      };
      onFileUpdate(updated);
      try {
        const remoteUrl = await uploadWithRetry(draftId, fileName, blob, (progress) => {
          onFileUpdate({ ...updated, progress });
        });
        onFileUpdate({ ...updated, status: "done", progress: 100, remoteUrl });
      } catch {
        onFileUpdate({ ...updated, status: "failed", error: "Upload failed" });
      }
    },
    [draftId, onFileUpdate],
  );

  useEffect(() => {
    return () => {
      firstLandedRef.current = false;
    };
  }, []);

  return {
    processQueue,
    retryFile,
    rejections,
    formatSaving: (original: number, compressed?: number) =>
      compressed
        ? `${formatBytes(original)} → ${formatBytes(compressed)}`
        : formatBytes(original),
  };
}
