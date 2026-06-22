import { publicAssetPath } from "@/shared/assets";

const palette = [
  "#2f2cff",
  "#ef2b2d",
  "#d729e8",
  "#11944b",
  "#43cce8",
  "#e8a317",
  "#ff6b35",
  "#8b5cf6",
  "#14b8a6",
  "#f43f5e",
  "#6366f1",
  "#84cc16",
  "#0ea5e9",
] as const;

const categorySlugs = [
  "advertisements",
  "drinks",
  "editorial",
  "fashion",
  "food",
  "gifts",
  "hotels",
  "industrial",
  "luxury",
  "perfumes",
  "premium",
  "saree",
  "watches",
] as const;

export type HomeCategory = {
  slug: (typeof categorySlugs)[number];
  label: string;
  color: string;
  image: string;
};

const titleCase = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1);

export const homeCategories: HomeCategory[] = categorySlugs.map(
  (slug, index) => ({
    slug,
    label: titleCase(slug),
    color: palette[index % palette.length],
    image: publicAssetPath(`/media/home-page-categories/${slug}.webp`),
  }),
);
