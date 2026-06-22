import type { MediaKind } from "./media-types";

export type UploadStatus = "queued" | "uploading" | "done" | "error";

// One file tracked through the upload pipeline, with editable alt text.
export type UploadItem = {
  id: string;
  file: File;
  kind: MediaKind;
  alt: string;
  status: UploadStatus;
  error?: string;
};

export function kindForFile(file: File): MediaKind {
  return file.type.startsWith("video/") ? "video_file" : "image";
}

export function toUploadItem(file: File): UploadItem {
  return {
    id: crypto.randomUUID(),
    file,
    kind: kindForFile(file),
    alt: "",
    status: "queued",
  };
}
