"use client";

import { useCallback, useState } from "react";

import { uploadOne } from "../lib/upload-one";
import { toUploadItem, type UploadItem } from "../lib/upload-item";

// Orchestrates the upload queue with per-item status. The alt-text gate blocks
// image assets from being created without a description (accessibility).
export function useUpload(onUploaded?: () => void) {
  const [items, setItems] = useState<UploadItem[]>([]);

  const patch = useCallback((id: string, next: Partial<UploadItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...next } : i)));
  }, []);

  const addFiles = useCallback((files: File[]) => {
    setItems((prev) => [...prev, ...files.map(toUploadItem)]);
  }, []);

  const setAlt = useCallback(
    (id: string, alt: string) => patch(id, { alt }),
    [patch],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const upload = useCallback(async () => {
    for (const item of items) {
      if (item.status === "done") continue;
      if (item.kind === "image" && !item.alt.trim()) {
        patch(item.id, { status: "error", error: "Alt text required" });
        continue;
      }
      patch(item.id, { status: "uploading", error: undefined });
      try {
        await uploadOne(item);
        patch(item.id, { status: "done" });
        onUploaded?.();
      } catch (cause) {
        const error = cause instanceof Error ? cause.message : "Upload failed";
        patch(item.id, { status: "error", error });
      }
    }
  }, [items, patch, onUploaded]);

  return { items, addFiles, setAlt, upload, removeItem };
}
