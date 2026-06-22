"use client";

import { useMemo, useState } from "react";

import type { ShowcaseVideo } from "@/features/home/showcase-data";

import { ShowcaseVideoCard } from "./showcase-video-card";
import { useShowcaseCarousel } from "./use-showcase-carousel";

type ShowcaseRowProps = {
  direction: "forward" | "backward";
  videos: ShowcaseVideo[];
};

function buildCarouselSlides(videos: ShowcaseVideo[]) {
  return [...videos, ...videos, ...videos];
}

export function ShowcaseRow({ videos, direction }: ShowcaseRowProps) {
  const carouselSlides = useMemo(() => buildCarouselSlides(videos), [videos]);
  const viewportRef = useShowcaseCarousel(direction, videos.length);
  // Only one player mounts per row at a time; leaving/closing unmounts it so
  // memory and bandwidth stay flat no matter how many cards exist.
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="showcase-row">
      <div className="showcase-row__viewport" ref={viewportRef}>
        <div className="showcase-row__track">
          {carouselSlides.map((video, index) => {
            const id = `${video.slug}-${index}`;
            return (
              <ShowcaseVideoCard
                isActive={activeId === id}
                key={id}
                onActivate={() => setActiveId(id)}
                onDeactivate={() =>
                  setActiveId((current) => (current === id ? null : current))
                }
                video={video}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
