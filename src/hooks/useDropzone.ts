"use client";

import { useCallback, useRef, useState } from "react";

type DropzoneOptions = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
};

export function useDropzone({ onFiles, disabled }: DropzoneOptions) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled],
  );

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled],
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [disabled, onFiles],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) onFiles(files);
      e.target.value = "";
    },
    [onFiles],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData.items;
      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) onFiles(files);
    },
    [disabled, onFiles],
  );

  return {
    isDragOver,
    open,
    inputRef,
    rootProps: {
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      onPaste,
    },
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      accept: "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif",
      multiple: true,
      className: "sr-only",
      onChange: onInputChange,
      "aria-hidden": true,
    },
  };
}
