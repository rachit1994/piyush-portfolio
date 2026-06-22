import { ClosingSection } from "./components/closing-section";
import { Hero } from "./components/hero";
import { MediaStrip } from "./components/media-strip";
import { PlaygroundSection } from "./components/playground-section";
import { BrandsSection } from "./components/brands-section";
import { ShowcaseSection } from "./components/showcase-section";

export function HomePage() {
  return (
    <>
      <Hero />
      <MediaStrip />
      <ShowcaseSection />
      <BrandsSection />
      <PlaygroundSection />
      <ClosingSection />
    </>
  );
}
