"use client";

import { useCallback, useEffect, useState } from "react";

import { deleteMediaAsset, listMediaAssets } from "../lib/upload-client";
import type { MediaAsset } from "../lib/media-types";
import { MediaCard } from "./media-card";

// Grid of existing media_assets, newest first. Deleting removes the metadata
// row only — the R2 object is intentionally left in place (out of scope).
export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMediaAssets()
      .then(setAssets)
      .catch((cause) => {
        setError(
          cause instanceof Error ? cause.message : "Could not load media",
        );
      });
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteMediaAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <section className="media-library" aria-label="Media library">
      {error && <p className="admin-status">{error}</p>}
      <ul className="media-grid">
        {assets.map((asset) => (
          <MediaCard key={asset.id} asset={asset} onDelete={remove} />
        ))}
      </ul>
    </section>
  );
}
