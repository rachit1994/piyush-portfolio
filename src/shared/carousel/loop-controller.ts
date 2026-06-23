import type { EmblaCarouselType } from "embla-carousel";

export function createLoopController(
  emblaApi: EmblaCarouselType,
  slideCount: number,
  isResetting: { current: boolean },
  reduceMotion: MediaQueryList,
) {
  const autoScroll = emblaApi.plugins().autoScroll;

  const applyMotionPreference = () => {
    if (reduceMotion.matches) autoScroll?.stop();
    else autoScroll?.play(0);
  };

  const resetToMiddleSet = (distance: number) => {
    const engine = emblaApi.internalEngine();
    [
      engine.location,
      engine.offsetLocation,
      engine.previousLocation,
      engine.target,
    ].forEach((vector) => vector.add(distance));
    engine.translate.to(engine.location.get());
  };

  const keepWithinMiddleSet = () => {
    if (isResetting.current) return;
    const slides = emblaApi.slideNodes();
    const first = slides[0];
    const firstMiddle = slides[slideCount];
    if (!first || !firstMiddle) return;
    const setWidth = firstMiddle.offsetLeft - first.offsetLeft;
    if (!setWidth) return;
    const location = emblaApi.internalEngine().location.get();
    const distance =
      location <= setWidth * -2 ? setWidth : location >= 0 ? -setWidth : 0;
    if (!distance) return;
    const wasPlaying = autoScroll?.isPlaying() ?? false;
    isResetting.current = true;
    autoScroll?.stop();
    resetToMiddleSet(distance);
    if (wasPlaying && !reduceMotion.matches) autoScroll?.play(0);
    isResetting.current = false;
  };

  return { applyMotionPreference, keepWithinMiddleSet };
}
