"use client";

import { useHoverIntent } from "@/shared/hooks/use-hover-intent";
import { buildYoutubeEmbedUrl } from "@/shared/youtube/embed-url";
import {
  buildYoutubeThumbnailSrcSet,
  buildYoutubeThumbnailUrl,
} from "@/shared/youtube/thumbnail-url";

import type { WorkVideoItem } from "../work-types";

type WorkVideoCardProps = {
  video: WorkVideoItem;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export function WorkVideoCard({
  video,
  isActive,
  onActivate,
  onDeactivate,
}: WorkVideoCardProps) {
  const intent = useHoverIntent({ onActivate, onDeactivate });

  return (
    <figure
      className="showcase-card"
      onPointerEnter={intent.onPointerEnter}
      onPointerLeave={intent.onPointerLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube CDN thumbnail */}
      <img
        alt=""
        className="showcase-card__poster"
        decoding="async"
        loading="lazy"
        sizes="(max-width: 700px) 70vw, 280px"
        src={buildYoutubeThumbnailUrl(video.videoId)}
        srcSet={buildYoutubeThumbnailSrcSet(video.videoId)}
      />
      {isActive ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="showcase-card__video showcase-card__video--interactive"
          src={buildYoutubeEmbedUrl(video.videoId)}
          title={video.title}
        />
      ) : (
        <button
          aria-label={`Play ${video.title}`}
          className="showcase-card__facade"
          onClick={intent.onClick}
          onFocus={intent.onFocus}
          type="button"
        >
          <span aria-hidden="true" className="showcase-card__play" />
        </button>
      )}
    </figure>
  );
}
