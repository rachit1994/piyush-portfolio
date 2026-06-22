import { ClosingSection } from "./components/closing-section";
import { Hero } from "./components/hero";
import { MediaStrip } from "./components/media-strip";
import { PlaygroundSection } from "./components/playground-section";
import { ServicesSection } from "./components/services-section";
import { WorkSection } from "./components/work-section";

export function HomePage() {
  return (
    <>
      <Hero />
      <MediaStrip />
      <ServicesSection />
      <WorkSection />
      <PlaygroundSection />
      <ClosingSection />
    </>
  );
}
