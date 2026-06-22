"use client";

import { homeCategories } from "@/features/home/home-data";

import { MediaStripSlide } from "./media-strip-slide";
import { useMediaStripCarousel } from "./use-media-strip-carousel";

const carouselSlides = [
  ...homeCategories,
  ...homeCategories,
  ...homeCategories,
];

export function MediaStripCarousel() {
  const viewportRef = useMediaStripCarousel(homeCategories.length);
  return (
    <section aria-label="Photography categories" className="media-strip">
      <div className="media-strip-viewport" ref={viewportRef}>
        <div className="media-strip-track">
          {carouselSlides.map((category, index) => (
            <MediaStripSlide
              category={category}
              key={`${category.slug}-${index}`}
            />
          ))}
        </div>
      </div>
      <span className="drag-hint">Drag or scroll</span>
    </section>
  );
}
