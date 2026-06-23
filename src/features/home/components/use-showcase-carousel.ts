"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import WheelGestures from "embla-carousel-wheel-gestures";
import { useEffect, useMemo, useRef } from "react";

import { createLoopController } from "@/shared/carousel/loop-controller";

type ScrollDirection = "forward" | "backward";

const carouselOptions = {
  align: "start" as const,
  dragFree: true,
  loop: false,
};

const autoScrollSpeed = 0.35;

export function useShowcaseCarousel(
  direction: ScrollDirection,
  slideCount: number,
) {
  const isResetting = useRef(false);
  const plugins = useMemo(
    () => [
      AutoScroll({
        direction,
        playOnInit: true,
        speed: autoScrollSpeed,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
      WheelGestures({ forceWheelAxis: "x" }),
    ],
    [direction],
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { ...carouselOptions, startIndex: slideCount },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const { applyMotionPreference, keepWithinMiddleSet } = createLoopController(
      emblaApi,
      slideCount,
      isResetting,
      reduceMotion,
    );
    keepWithinMiddleSet();
    applyMotionPreference();
    emblaApi.on("scroll", keepWithinMiddleSet);
    emblaApi.on("reInit", keepWithinMiddleSet);
    reduceMotion.addEventListener("change", applyMotionPreference);
    return () => {
      emblaApi.off("scroll", keepWithinMiddleSet);
      emblaApi.off("reInit", keepWithinMiddleSet);
      reduceMotion.removeEventListener("change", applyMotionPreference);
    };
  }, [emblaApi, slideCount]);

  return viewportRef;
}
