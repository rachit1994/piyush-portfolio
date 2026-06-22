"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import WheelGestures from "embla-carousel-wheel-gestures";
import { useEffect, useMemo, useRef } from "react";

import { createLoopController } from "./media-strip-loop";

const carouselOptions = {
  align: "start" as const,
  dragFree: true,
  loop: false,
};

export function useMediaStripCarousel(projectCount: number) {
  const isResetting = useRef(false);
  const plugins = useMemo(
    () => [
      AutoScroll({
        direction: "forward",
        playOnInit: true,
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
      WheelGestures({ forceWheelAxis: "y" }),
    ],
    [],
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { ...carouselOptions, startIndex: projectCount },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const { applyMotionPreference, keepWithinMiddleSet } = createLoopController(
      emblaApi,
      projectCount,
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
  }, [emblaApi, projectCount]);

  return viewportRef;
}
