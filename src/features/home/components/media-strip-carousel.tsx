"use client";

import { projects } from "@/features/home/home-data";

import { MediaStripSlide } from "./media-strip-slide";
import { useMediaStripCarousel } from "./use-media-strip-carousel";

const carouselSlides = [...projects, ...projects, ...projects];

export function MediaStripCarousel() {
  const viewportRef = useMediaStripCarousel(projects.length);
  return (
    <section aria-label="Selected work preview" className="media-strip">
      <div className="media-strip-viewport" ref={viewportRef}>
        <div className="media-strip-track">
          {carouselSlides.map((project, index) => (
            <MediaStripSlide
              index={index % projects.length}
              key={`${project.name}-${index}`}
              project={project}
            />
          ))}
        </div>
      </div>
      <span className="drag-hint">Drag or scroll</span>
    </section>
  );
}
