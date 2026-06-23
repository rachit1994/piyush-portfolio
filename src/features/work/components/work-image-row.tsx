"use client";

import { useMemo } from "react";

import {
  buildCategorySrc,
  buildCategorySrcSet,
  categoryImageSizes,
} from "@/shared/assets/category-srcset";

import type { WorkImageItem } from "../work-types";
import { useWorkCarousel } from "../lib/use-work-carousel";

type WorkImageRowProps = {
  images: WorkImageItem[];
  speed: number;
  direction?: "forward" | "backward";
};

function buildSlides(items: WorkImageItem[]) {
  return [...items, ...items, ...items];
}

export function WorkImageRow({
  images,
  speed,
  direction = "forward",
}: WorkImageRowProps) {
  const slides = useMemo(() => buildSlides(images), [images]);
  const viewportRef = useWorkCarousel(images.length, { speed, direction });

  return (
    <div className="work-section work-section--images">
      <div className="work-row__viewport" ref={viewportRef}>
        <div className="work-row__track">
          {slides.map((img, index) => (
            <figure className="work-image-card" key={`${img.slug}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized responsive asset */}
              <img
                alt={img.alt}
                className="work-image-card__img"
                decoding="async"
                loading="lazy"
                sizes={categoryImageSizes}
                src={buildCategorySrc(img.src)}
                srcSet={buildCategorySrcSet(img.src)}
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
