import { publicAssetPath } from "@/shared/assets";

export { homeCategories } from "./home-categories";
export type { HomeCategory } from "./home-categories";

export const projectTagColors = {
  Product: "#2f2cff",
  AI: "#ef2b2d",
  Platforms: "#d729e8",
  Fintech: "#11944b",
  Communities: "#43cce8",
} as const;

export const projects = [
  {
    name: "Northstar",
    tags: ["Product", "AI"],
    image: publicAssetPath("/media/northstar.jpg"),
    summary:
      "A focused identity and product language for an AI workspace that turns scattered signals into clear decisions.",
  },
  {
    name: "Common Ground",
    tags: ["Fintech", "Platforms"],
    image: publicAssetPath("/media/common-ground.jpg"),
    summary:
      "A warm, credible system for climate finance—designed to make complex progress feel tangible and trustworthy.",
  },
  {
    name: "Loop",
    tags: ["Product", "Communities"],
    image: publicAssetPath("/media/loop.jpg"),
    summary:
      "A playful planning experience built around shared time, clear rituals, and an identity that stays memorable.",
  },
  {
    name: "First Step",
    tags: ["Platforms", "Communities"],
    image: publicAssetPath("/media/first-step.jpg"),
    summary:
      "A confident career platform that helps early talent move from uncertainty to momentum with clarity.",
  },
] as const;
