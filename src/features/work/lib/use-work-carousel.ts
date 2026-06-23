"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import WheelGestures from "embla-carousel-wheel-gestures";
import { useEffect, useMemo, useRef } from "react";

import { createLoopController } from "@/shared/carousel/loop-controller";

type WorkCarouselOptions = {
  speed: number;
  direction?: "forward" | "backward";
};

export function useWorkCarousel(
  slideCount: number,
  options: WorkCarouselOptions,
) {
  const { speed, direction = "forward" } = options;
  const isResetting = useRef(false);
  const plugins = useMemo(
    () => [
      AutoScroll({
        direction,
        playOnInit: true,
        speed,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
      WheelGestures({ forceWheelAxis: "x" }),
    ],
    [direction, speed],
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { align: "start", dragFree: true, loop: false, startIndex: slideCount },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ctrl = createLoopController(
      emblaApi,
      slideCount,
      isResetting,
      reduceMotion,
    );
    ctrl.keepWithinMiddleSet();
    ctrl.applyMotionPreference();
    emblaApi.on("scroll", ctrl.keepWithinMiddleSet);
    emblaApi.on("reInit", ctrl.keepWithinMiddleSet);
    reduceMotion.addEventListener("change", ctrl.applyMotionPreference);
    return () => {
      emblaApi.off("scroll", ctrl.keepWithinMiddleSet);
      emblaApi.off("reInit", ctrl.keepWithinMiddleSet);
      reduceMotion.removeEventListener("change", ctrl.applyMotionPreference);
    };
  }, [emblaApi, slideCount]);

  return viewportRef;
}
