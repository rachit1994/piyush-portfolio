"use client";

import type { UploadItem } from "../lib/upload-item";

type Props = {
  item: UploadItem;
  onAlt: (id: string, alt: string) => void;
  onRemove: (id: string) => void;
};

// One queued file: name, live status, the required alt input for images, and a
// remove control. Pure presentation driven by useUpload state.
export function UploadItemRow({ item, onAlt, onRemove }: Props) {
  const altId = `alt-${item.id}`;
  return (
    <li className="media-item" data-status={item.status}>
      <span className="media-item__name">{item.file.name}</span>
      {item.kind === "image" && (
        <label className="media-item__alt" htmlFor={altId}>
          <span className="media-item__alt-label">Alt text</span>
          <input
            id={altId}
            value={item.alt}
            placeholder="Describe this image"
            onChange={(e) => onAlt(item.id, e.target.value)}
          />
        </label>
      )}
      <span className="media-item__status" role="status">
        {item.error ?? item.status}
      </span>
      <button
        type="button"
        className="admin-link-button"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </li>
  );
}
