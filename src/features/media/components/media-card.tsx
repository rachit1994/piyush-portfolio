"use client";

import { CloudflareImage } from "@/shared/ui";

import type { MediaAsset } from "../lib/media-types";

type Props = { asset: MediaAsset; onDelete: (id: string) => void };

// One library tile. Images render through the edge-optimized CloudflareImage;
// video files show a neutral placeholder (no client video decode here).
export function MediaCard({ asset, onDelete }: Props) {
  return (
    <li className="media-card">
      {asset.kind === "image" && asset.r2_key ? (
        <CloudflareImage
          source={asset.r2_key}
          alt={asset.alt ?? ""}
          width={asset.width ?? 1200}
          height={asset.height ?? 800}
          sizes="(max-width: 600px) 50vw, 240px"
        />
      ) : (
        <span className="media-card__video">Video file</span>
      )}
      <button
        type="button"
        className="admin-link-button"
        onClick={() => onDelete(asset.id)}
      >
        Delete
      </button>
    </li>
  );
}
