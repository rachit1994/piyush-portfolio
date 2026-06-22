"use client";

import { buildYoutubeEmbedUrl } from "@/features/home/lib/showcase-embed-url";
import {
  buildYoutubeThumbnailSrcSet,
  buildYoutubeThumbnailUrl,
} from "@/features/home/lib/showcase-thumbnail-url";
import type { ShowcaseVideo } from "@/features/home/showcase-videos";

import { useHoverIntent } from "./use-hover-intent";

type ShowcaseVideoCardProps = {
  video: ShowcaseVideo;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export function ShowcaseVideoCard({
  video,
  isActive,
  onActivate,
  onDeactivate,
}: ShowcaseVideoCardProps) {
  const intent = useHoverIntent({ onActivate, onDeactivate });

  return (
    <figure
      className="showcase-card"
      onPointerEnter={intent.onPointerEnter}
      onPointerLeave={intent.onPointerLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube CDN thumbnail, not optimizable by next/image in a static export */}
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="showcase-card__video showcase-card__video--interactive"
          src={buildYoutubeEmbedUrl(video.videoId)}
          title={video.title}
        />
      ) : (
        <button
          aria-label={`Play video: ${video.title}`}
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
