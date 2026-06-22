"use client";

import { useUpload } from "../hooks/use-upload";
import { MediaDropZone } from "./media-drop-zone";
import { UploadItemRow } from "./upload-item-row";

// Drag-drop + multi-file uploader. Images require alt text before they upload
// (enforced in useUpload); video stores null dimensions.
export function MediaUploader({ onUploaded }: { onUploaded?: () => void }) {
  const { items, addFiles, setAlt, upload, removeItem } = useUpload(onUploaded);
  const hasQueued = items.some((i) => i.status !== "done");

  return (
    <section className="media-uploader" aria-label="Upload media">
      <MediaDropZone onFiles={addFiles} />
      {items.length > 0 && (
        <ul className="media-queue">
          {items.map((item) => (
            <UploadItemRow
              key={item.id}
              item={item}
              onAlt={setAlt}
              onRemove={removeItem}
            />
          ))}
        </ul>
      )}
      {hasQueued && (
        <button
          type="button"
          className="dark-button"
          onClick={() => void upload()}
        >
          Upload {items.length} file{items.length === 1 ? "" : "s"}
        </button>
      )}
    </section>
  );
}
