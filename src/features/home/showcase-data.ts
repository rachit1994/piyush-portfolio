import { showcaseVideos } from "./showcase-videos";

const splitAt = Math.ceil(showcaseVideos.length / 2);

export { type ShowcaseVideo } from "./showcase-videos";
export const showcaseTopRow = showcaseVideos.slice(0, splitAt);
export const showcaseBottomRow = showcaseVideos.slice(splitAt);
