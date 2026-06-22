import {
  showcaseBottomRow,
  showcaseTopRow,
} from "@/features/home/showcase-data";

import { ShowcaseRow } from "./showcase-rows";

export function ShowcaseSection() {
  return (
    <section aria-label="Featured work gallery" className="showcase">
      <div className="showcase-shell">
        <h2 className="showcase-title">Trust is the currency</h2>
        <div className="showcase-rows">
          <ShowcaseRow direction="forward" videos={showcaseTopRow} />
          <ShowcaseRow direction="backward" videos={showcaseBottomRow} />
        </div>
      </div>
    </section>
  );
}
