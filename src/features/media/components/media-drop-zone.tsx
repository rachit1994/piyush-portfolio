"use client";

import { useRef, useState, type DragEvent } from "react";

const ACCEPT = "image/*,video/*";

// Drag-drop surface plus a keyboard-reachable file input. Emits picked files;
// it owns no upload state of its own.
export function MediaDropZone({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    onFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div
      className={`media-drop${over ? "media-drop--over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <p>Drag files here, or</p>
      <button
        type="button"
        className="admin-link-button"
        onClick={() => inputRef.current?.click()}
      >
        Choose files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="media-drop__input"
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
    </div>
  );
}
