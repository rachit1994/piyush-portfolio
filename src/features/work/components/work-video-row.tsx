"use client";

import { useMemo, useState } from "react";

import type { WorkVideoItem } from "../work-types";
import { useWorkCarousel } from "../lib/use-work-carousel";
import { WorkVideoCard } from "./work-video-card";

type WorkVideoRowProps = { videos: WorkVideoItem[] };

function buildSlides(items: WorkVideoItem[]) {
  return [...items, ...items, ...items];
}

export function WorkVideoRow({ videos }: WorkVideoRowProps) {
  const slides = useMemo(() => buildSlides(videos), [videos]);
  const viewportRef = useWorkCarousel(videos.length, { speed: 0.4 });
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="work-section work-section--video">
      <div className="work-row__viewport" ref={viewportRef}>
        <div className="work-row__track">
          {slides.map((video, index) => {
            const id = `${video.slug}-${index}`;
            return (
              <WorkVideoCard
                isActive={activeId === id}
                key={id}
                onActivate={() => setActiveId(id)}
                onDeactivate={() =>
                  setActiveId((cur) => (cur === id ? null : cur))
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
